const mongoose = require('mongoose');

const appSettingsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    description: String,
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Static method to get a setting
appSettingsSchema.statics.getSetting = async function (key) {
    const setting = await this.findOne({ key });
    return setting ? setting.value : null;
};

// Static method to set a setting
appSettingsSchema.statics.setSetting = async function (key, value, description = '', userId = null) {
    return await this.findOneAndUpdate(
        { key },
        {
            value,
            description,
            updatedBy: userId
        },
        { upsert: true, new: true }
    );
};

// Initialize default settings
appSettingsSchema.statics.initDefaults = async function () {
    const defaults = [
        {
            key: 'portalAccessCode',
            value: 'shami',
            description: 'Staff portal access code required for login'
        },
        {
            key: 'companyName',
            value: 'Kipharma',
            description: 'Company name displayed on website'
        },
        {
            key: 'companyEmail',
            value: 'info@kipharma.rw',
            description: 'Main company email'
        },
        {
            key: 'companyPhone',
            value: '+250 788 000 000',
            description: 'Main company phone'
        }
    ];

    for (const setting of defaults) {
        await this.findOneAndUpdate(
            { key: setting.key },
            { $setOnInsert: setting },
            { upsert: true }
        );
    }
    console.log('✅ Default settings initialized');
};

module.exports = mongoose.model('AppSettings', appSettingsSchema);
