class MarketplaceScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MarketplaceScene' });
        this.collectedItems = new Set();
        this.isScalePuzzleActive = false;
        this.currentWeight = 0;
        this.targetWeight = 100; // Set your desired target weight for the puzzle
    }

    create() {
        // Add responsive background
        const bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'marketplace_bg');
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Create UI elements
        this.createUI();

        // Create collectible items
        this.createCollectibles();

        // Create merchant's scale (initially hidden)
        this.createScalePuzzle();

        // Show welcome message
        this.showMessage("Welcome to the Ancient Marketplace! Find the hidden artifacts.");
    }

    createUI() {
        this.inventoryPanel = this.add.container(650, 100).setSize(250, 400);

        const invBg = this.add.rectangle(0, 0, 250, 400, 0x000000, 0.7).setOrigin(0, 0);
        const invTitle = this.add.text(10, 10, "Detective's Journal", {
            fontSize: '20px',
            fill: '#FFD700'
        }).setOrigin(0, 0);

        this.inventoryPanel.add([invBg, invTitle]);

        this.objectiveText = this.add.text(20, 20, 'Current Objective: Find the historical artifacts', {
            fontSize: '16px',
            fill: '#ffffff',
            wordWrap: { width: 200 }
        });
    }

    createCollectibles() {
        const items = [
            { key: 'bull_figurine', x: 200, y: 300, name: 'Clay Bull Figurine', desc: 'An ancient symbol of economic power' },
            { key: 'lapis_bead', x: 400, y: 400, name: 'Lapis Lazuli Bead', desc: 'A precious trade item from distant lands' },
            { key: 'copper_weights', x: 600, y: 350, name: 'Copper Weights', desc: 'Used for accurate trading' }
        ];

        items.forEach(item => {
            const sprite = this.add.sprite(item.x, item.y, item.key)
                .setInteractive()
                .setScale(1.0);

            sprite.on('pointerover', () => {
                sprite.setScale(1.2);
                this.showTooltip(item.name, item.x, item.y);
            });

            sprite.on('pointerout', () => {
                sprite.setScale(1.0);
                this.hideTooltip();
            });

            sprite.on('pointerdown', () => {
                this.collectItem(item);
                sprite.destroy();

                // Start mini-game if copper weights are collected
                if (item.key === 'copper_weights') {
                    this.startScaleMiniGame();
                }
            });
        });
    }

    createScalePuzzle() {
        this.scalePuzzle = this.add.container(400, 450);
        
        this.merchantScale = this.add.image(0, 0, 'merchant_scale').setVisible(false);

        const minusBtn = this.add.rectangle(-50, 50, 30, 30, 0x666666)
            .setInteractive()
            .on('pointerdown', () => this.adjustWeight(-5));
        
        const plusBtn = this.add.rectangle(50, 50, 30, 30, 0x666666)
            .setInteractive()
            .on('pointerdown', () => this.adjustWeight(5));
        
        this.weightText = this.add.text(0, 50, '0', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.scalePuzzle.add([this.merchantScale, minusBtn, plusBtn, this.weightText]);
    }

    // Function to start the scale mini-game
    startScaleMiniGame() {
        this.showMessage("Let's see if I can match these weights...");
        this.isScalePuzzleActive = true;
        this.merchantScale.setVisible(true);
        this.currentWeight = 0; // Reset current weight for the mini-game
        this.weightText.setText(this.currentWeight); // Reset the displayed weight

        // Internal monologue message
        this.showMessage("This place is ancient, yet their trade systems are surprisingly advanced. These weights… they must have been crucial for their commerce.");
    }

    // Function to show a tooltip when hovering over an item
    showTooltip(name, x, y) {
        this.tooltip = this.add.text(x, y - 40, name, {
            fontSize: '14px',
            fill: '#ffffff',
            backgroundColor: '#000',
            padding: {
                left: 5,
                right: 5,
                top: 5,
                bottom: 5
            }
        }).setDepth(1);
    }

    // Function to hide the tooltip when not hovering over an item
    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.destroy();
        }
    }

    // Function to collect an item and add it to the inventory
    collectItem(item) {
        if (!this.collectedItems.has(item.key)) {
            this.collectedItems.add(item.key);

            const collectedItemText = this.add.text(20, 40 + (this.collectedItems.size * 20), item.name, {
                fontSize: '14px',
                fill: '#ffffff'
            });
            this.inventoryPanel.add(collectedItemText);

            this.showMessage(`${item.name} collected!`);
        }
    }

    // Function to show a message in the message box
    showMessage(message) {
        if (this.messageBox) {
            this.messageBox.destroy();
        }

        this.messageBox = this.add.text(20, 550, message, {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#444',
            padding: {
                left: 10,
                right: 10,
                top: 5,
                bottom: 5
            }
        }).setDepth(1);

        // Auto-hide message after 3 seconds
        this.time.delayedCall(3000, () => {
            if (this.messageBox) {
                this.messageBox.destroy();
            }
        });
    }

    // Function to adjust the weight on the merchant's scale puzzle
    adjustWeight(amount) {
        if (this.isScalePuzzleActive) {
            this.currentWeight += amount;
            this.currentWeight = Phaser.Math.Clamp(this.currentWeight, 0, this.targetWeight);
            this.weightText.setText(this.currentWeight);

            if (this.currentWeight === this.targetWeight) {
                this.showMessage("Correct weight! You've solved the puzzle!");
                this.isScalePuzzleActive = false;
                this.merchantScale.setVisible(false); // Hide the scale puzzle when done
                this.deductionAfterPuzzle(); // Call deduction function after solving
            }
        }
    }

    // Function to handle deductions after the puzzle is solved
    deductionAfterPuzzle() {
        this.showMessage("The balance must be perfect. The syndicate likely used these very systems to win over the trust of the locals—always staying one step ahead. I need to move fast before they disappear.");
    }
}
