// This script helps deploy Firestore rules
// Run with: node deploy-rules.js

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Preparing to deploy Firestore rules...');

// Check if firebase-tools is installed
exec('npx firebase --version', (error) => {
    if (error) {
        console.log('Installing firebase-tools...');
        exec('npm install -g firebase-tools', (err) => {
            if (err) {
                console.error('Failed to install firebase-tools:', err);
                return;
            }
            deployRules();
        });
    } else {
        deployRules();
    }
});

function deployRules() {
    console.log('Deploying Firestore rules...');

    // Create a temporary firebase.json file
    const firebaseConfig = {
        firestore: {
            rules: 'firestore.rules',
        }
    };

    fs.writeFileSync('firebase.json', JSON.stringify(firebaseConfig, null, 2));

    // Deploy the rules
    exec('firebase deploy --only firestore:rules', (error, stdout, stderr) => {
        if (error) {
            console.error('Error deploying rules:', error);
            console.log('You may need to login first with: firebase login');
            return;
        }

        console.log(stdout);
        console.log('Firestore rules deployed successfully!');
        console.log('Your application should now have proper permissions.');

        // Clean up
        fs.unlinkSync('firebase.json');
    });
} 