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
    
    stage ('Code evaluation') {
      parallel {
        stage ('test') {
          steps {
            // Start a docker image with mongo database tu run tests
            sh 'docker run -d -p 27017:27017 --name ' + MONGO_CONTAINER_NAME + ' mongo:3.4-jessie'
            sh 'npm run test'
          }
        }

        stage ('linter') {
          steps {
            sh 'npm run lint'
          }
        }
      }
    } 

  }
  
  post {
    // Whatever happens, kill the docker process before exit
    always {
      sh 'docker rm -f ' + MONGO_CONTAINER_NAME
    }
  }
}