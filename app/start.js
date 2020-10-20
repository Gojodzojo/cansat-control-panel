const fs = require('fs')
const { spawn } = require('child_process')
const fileFormat = 'go'
let isTriggered = false
let process
let directoryName = __dirname.split("\\")
directoryName = directoryName[directoryName.length -1]

console.log(`Watching ${directoryName}`)
process = spawn(`${directoryName}.exe`)
process.stdout.on('data', data => console.log(data.toString('utf-8')))
process.stderr.on('data', data => console.log(data.toString('utf-8')))

fs.watch(__dirname, (event, trigger) => {
    if(trigger.split('.')[1] == fileFormat && !isTriggered) {
        isTriggered = true
        if(process !== undefined) {
            process.kill()
        }
        const buildProcess = spawn('go build', {shell: true})
        buildProcess.stderr.on('data', data => console.log(data.toString('utf-8')))
        buildProcess.on('error', error => console.log(error))
        buildProcess.on('close', () => {
            console.log('Built successfully')
            process = spawn(`${directoryName}.exe`)
            process.stdout.on('data', data => console.log(data.toString('utf-8')))
            process.stderr.on('data', data => console.log(data.toString('utf-8')))
        })

        setTimeout(() => {isTriggered = false}, 100)
    }
})

