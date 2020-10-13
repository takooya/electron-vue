<template>
    <div id="app">
        <first-page></first-page>
    </div>
</template>

<script>
    import djPdfViewer from './components/dj-pdf-viewer/djPdfViewer.vue'
    import FirstPage from "./components/FirstPage";

    export default {
        name: 'App',
        components: {
            FirstPage
        },
        data() {
            return {
                //path: process.cwd() + "\\test\\test.pdf"    //大文件
                path: process.cwd() + "\\test\\test1.pdf"  //带印章3个
                // path: process.cwd() + "\\test\\test2.pdf"     //带印章1个
                // path: process.cwd() + "\\test\\test3.pdf"  //带目录
            }
        }
    }
</script>

<style>
    body {
        margin: 0;
        padding: 0;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        /*margin-top: 60px;*/
    }
</style>
