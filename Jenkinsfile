pipeline {

  agent any

  environment {
    def branchRenamed = env.BRANCH_NAME.replace('/', '_')
    MONGO_CONTAINER_NAME = "mongo_test_${branchRenamed}"
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

     stage ('Zip packaging') {
      steps {      

          sh 'zip -r agile-backend.zip ./  -x *.git* ./node_modules/\\*'
      }
    }

    stage ('Build Docker Image') {
      steps {
          sh 'docker build -f ./docker/Dockerfile ./ -t agile-tools-backend --network=host'
      }
    }
    
  }
}