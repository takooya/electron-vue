const nodePath = process.cwd() + "\\democpp.node"
try {
    //console.log('democpp.node-path=' + nodePath)
    global.process.dlopen(module, nodePath)
} catch (e) {
    throw new Error('Cannot open ' + nodePath + ': ' + e)
}
