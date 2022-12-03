module.exports = {
    apps : [{
      name: 'homestation_backend',
      script: 'bin/www',
    }
    ],

    // Deployment Configuration
    deploy : {
      production : {
         "user" : "github_deploy",
         "host" : ["fanmenrui.xyz"],
         "key": 'deploy.key',
         "ssh_options": "StrictHostKeyChecking=no",
         "ref"  : "origin/master",
         "repo" : "https://github.com/ma89vik/homestation_backend.git",
         "path" : "/var/www/homestation_backend",
         "post-deploy" : "npm install",
         'post-deploy': 'pm2 startOrRestart ecosystem.config.js',
      }
    }
  };
