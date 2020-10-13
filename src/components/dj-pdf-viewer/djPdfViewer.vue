<!--
点聚PDF阅读器
@auther: caotch
@since: 2020年3月21日 10:19:41
-->
<template>
    <el-container class="dj-pdf-viewer" v-loading="loading" element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-aside>
            <!--<iframe id="myIframe" :src="pdfHtmlPath"></iframe>-->
            <webview :src="pdfHtmlPath" nodeintegration></webview>
        </el-aside>
        <el-main>
            <input type="file" @change="openFile">
        </el-main>
    </el-container>
</template>

<script>
    import {ipcMain, ipcRenderer} from 'electron'
    import fileCpp from './democpp-loader.js'

    const path = require('path')

    export default {
        name: 'dj-pdf-viewer',
        props: {
            path: ''    //文件地址
        },
        data() {
            return {
                loading: false,
                pdfHtmlPath: path.join(__static, 'pdfjs/djpdf.html'),
            }
        },
        created() {
        },
        mounted() {
            let _this = this
            const webview = document.querySelector('webview')
            // 测试环境下打开，可以看到webview里得console.log
            webview.addEventListener('console-message', (e) => {
                // console.log('webview:\n', e.message)
            })
            // 在webview加载完成后执行。
            webview.addEventListener('dom-ready', (e) => {
                //_this.path = 'D:\\temp\\test1.pdf'
                //_this.path = process.cwd() + "\\test\\test1.pdf"
                webview.send("openFile", _this.path)
            })
            //监听子页面消息
            webview.addEventListener('ipc-message', (e) => {
                //console.log(e.channel)
                if (e.channel === 'getSeals') {
                    //获取印章信息
                    _this.getSeals()
                }
                if (e.channel.indexOf('verifySeal') >= 0) {
                    //验证印章信息
                    _this.verifySeal(e.channel.split(':')[1])
                }
            })
        },
        methods: {
            //打开文件
            openFile(event) {
                if (event.target.files) {
                    let file = event.target.files[0]
                    const webview = document.querySelector('webview')
                    webview.send("openFile", file.path)
                    this.path = file.path
                }
            },
            //获取印章信息
            getSeals() {
                let _this = this
                let seals = []
                //打开文件对象
                const objID = fileCpp.openobj(_this.path, 0, 0)
                //获取印章用户ID
                let userId = fileCpp.getnextuser(objID, '', 0)
                while (userId) {
                    //获取用户印章ID
                    let sealId = fileCpp.getnextnote(objID, userId, 0, '')
                    while (sealId) {
                        //获取印章信息
                        let sealInfo = {}
                        sealInfo.id = sealId
                        sealInfo.left = parseInt(fileCpp.getvalueex(objID, sealId, 6, '', 0, ''))   //获取印章的NOTE_VALUE_LEFTPOS  left值
                        sealInfo.top = parseInt(fileCpp.getvalueex(objID, sealId, 7, '', 0, ''))    //获取印章的NOTE_VALUE_TOPPOS  top值
                        sealInfo.width = parseInt(fileCpp.getvalueex(objID, sealId, 8, '', 0, ''))  //获取印章的NOTE_VALUE_WIDTH  width值
                        sealInfo.height = parseInt(fileCpp.getvalueex(objID, sealId, 9, '', 0, '')) //获取印章的NOTE_VALUE_HEIGHT  height值
                        sealInfo.page = parseInt(fileCpp.getvalueex(objID, sealId, 20, '', 0, ''))  //获取印章的NOTE_VALUE_PAGEINDEX  页码
                        sealInfo.certNo = fileCpp.getvalueex(objID, sealId, 30, '', 0, '')  //获取印章的NOTE_VALUE_CERTNO  证书序列号
                        sealInfo.certSubject = fileCpp.getvalueex(objID, sealId, 31, '', 0, '') //获取印章的NOTE_VALUE_CERTSUBJECT  证书所有者
                        sealInfo.sealID = fileCpp.getvalueex(objID, sealId, 32, '', 0, '')  //获取印章的NOTE_VALUE_SEALID  印章ID
                        sealInfo.sealName = fileCpp.getvalueex(objID, sealId, 33, '', 0, '')    //获取印章的NOTE_VALUE_SEALNAME  印章名称
                        sealInfo.sealTime = fileCpp.getvalueex(objID, sealId, 27, '', 0, '')    //获取印章的NOTE_VALUE_CREATETIME = 27,  盖章时间
                        //处理特殊字符问题
                        sealInfo.certNo = sealInfo.certNo.substr(0, (sealInfo.certNo.length - 1))
                        sealInfo.certSubject = sealInfo.certSubject.substr(0, (sealInfo.certSubject.length - 1))
                        // console.log("before:"+sealInfo.sealTime)
                        sealInfo.sealTime = sealInfo.sealTime.substr(0, (sealInfo.sealTime.length - 1))
                        if (sealInfo.sealName != null) {
                            sealInfo.sealName = sealInfo.sealName.substr(0, (sealInfo.sealName.length - 1))
                        }
                        seals.push(sealInfo)
                        //获取下一个印章
                        sealId = fileCpp.getnextnote(objID, userId, 0, sealId)
                    }
                    //获取下一个用户
                    userId = fileCpp.getnextuser(objID, userId, 0)
                }
                //console.log(seals)
                //关闭对象
                fileCpp.savefile(objID, '', '', 0)
                //调用子页面创建印章对象
                const webview = document.querySelector('webview')
                webview.send("createSeals", seals)
            },
            //验证印章
            verifySeal(sealId) {
                let _this = this
                //打开文件对象
                const objID = fileCpp.openobj(_this.path, 0, 0)
                //验证文件
                let verify = fileCpp.getvalueex(objID, sealId, 34, '', 0, '')
                if (verify.indexOf('1') < 0) {
                    _this.$message.error('印章验证失败，文件被修改！')
                } else {
                    _this.$message.success('印章验证成功，文件未被修改！')
                }
                //关闭对象
                fileCpp.savefile(objID, '', '', 0)
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .dj-pdf-viewer {
        .el-aside {
            width: calc(100% - 300px) !important;

            iframe {
                width: calc(100% - 5px);
                height: calc(100vh - 32px);
            }

            webview {
                width calc(100% - 5px);
                height: calc(100vh - 2px);
            }
        }
    }
</style>
