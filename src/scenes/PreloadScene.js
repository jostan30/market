class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width/4, height/2 - 30, width/2, 50);
        
        // Loading text
        const loadingText = this.add.text(width/2, height/2 - 50, 'Loading...', {
            font: '20px Arial',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);
        
        // Progress text
        const percentText = this.add.text(width/2, height/2, '0%', {
            font: '18px Arial',
            fill: '#ffffff'
        });
        percentText.setOrigin(0.5, 0.5);

        // Load assets
        this.load.svg('marketplace_bg', 'assets/images/backgrounds/marketplace-bg.svg');
        this.load.svg('bull_figurine', 'assets/images/items/bull-figurine.svg');
        this.load.svg('lapis_bead', 'assets/images/items/lapis-bead.svg');
        this.load.svg('copper_weights', 'assets/images/items/copper-weights.svg');
        this.load.svg('merchant_scale', 'assets/images/items/merchant-scale.svg');
        this.load.svg('dialogue_box', 'assets/images/ui/dialogue-box.svg');

        // Update progress bar
        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width/4 + 10, height/2 - 20, (width/2 - 20) * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });

        // Clean up loading bar
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
    }

    create() {
        this.scene.start('MarketplaceScene');
    }
}