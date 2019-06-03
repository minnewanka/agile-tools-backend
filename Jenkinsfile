pipeline {

  agent any

  environment {
    def branchRenamed = env.BRANCH_NAME.replace('/', '_')
    MONGO_CONTAINER_NAME = "mongo_test_${branchRenamed}"
    APP_NAME = 'agile-backend'
    APP_VERSION = '1.0.1-SNAPSHOT'
  }

  stages { 

    stage('Build init') {
      steps {
        // Use with this syntax to be able to call folder props
        // Such as the teams webhook url
        withFolderProperties {
          buildInit()
        }
      }
    }
     
    stage ('npm install') {
      steps {
        sh 'npm install'
      }
    }
    
    stage ('Linter') {
      steps {
        sh 'npm run lint'
      }
    } 

     stage ('Zip application') {
      steps {      

          sh 'zip -r ${env.APP_NAME}.zip ./  -x *.git* ./node_modules/\\*'
      }
    }

    stage ('Save on Nexus') { 
      steps {
        deployToMavenRepo (
          extractInfos : 'package.json',
          version : "${env.APP_VERSION}",
          artifactId : "${env.APP_NAME}",
          groupId : "com.siicanada.appagile",
          packageLocation : './',
          fileType : "zip"
        )
      }
    }

    stage ('Build Docker Image') {
      steps {
          sh 'docker build -f ./docker/Dockerfile ./ -t agile-tools-backend --network=host'
      }
    }
    
  }
}
