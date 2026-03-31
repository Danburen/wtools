<template>
  <div class="zip-tool">
    <h2>ZIP 压缩/解压工具</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="压缩文件" name="compress">
        <div class="operation-area">
          <el-upload
            class="upload-demo"
            drag
            multiple
            :auto-upload="false"
            :on-change="handleCompressChange"
            :on-remove="handleCompressRemove"
            :file-list="compressFiles"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽文件到此处，或 <em>点击选择文件</em>
            </div>
          </el-upload>

          <div class="action-bar" v-if="compressFiles.length > 0">
            <el-input v-model="zipFileName" placeholder="输入压缩包名 (默认: archive.zip)" style="width: 250px; margin-right: 15px;"></el-input>
            <el-button type="primary" @click="doCompress" :loading="isCompressing">压缩并下载</el-button>
          </div>

          <el-progress
            v-if="compressProgress > 0"
            :percentage="compressProgress"
            :text-inside="true"
            :stroke-width="20"
            status="success"
            class="mt-4"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="解压文件" name="decompress">
        <div class="operation-area">
          <el-upload
            class="upload-demo"
            drag
            :auto-upload="false"
            :on-change="handleDecompressChange"
            :file-list="singleZipFile"
            :limit="1"
            accept=".zip"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽ZIP文件到此处，或 <em>点击选择ZIP文件</em>
            </div>
          </el-upload>

          <div class="action-bar" v-if="singleZipFile.length > 0">
            <el-button type="primary" @click="doDecompress" :loading="isDecompressing">提取内容</el-button>
          </div>

          <el-progress
            v-if="decompressProgress > 0"
            :percentage="decompressProgress"
            :text-inside="true"
            :stroke-width="20"
            status="warning"
            class="mt-4"
          />

          <div v-if="unzippedFiles.length > 0" class="file-list mt-4">
            <h4>包含的文件:</h4>
            <el-table :data="unzippedFiles" border style="width: 100%">
              <el-table-column prop="name" label="文件名" />
              <el-table-column prop="size" label="大小 (Bytes)" width="150" />
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button size="small" @click="downloadFile(scope.row)">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { ElMessage } from 'element-plus'
import {UploadFilled} from "@element-plus/icons-vue";

const activeTab = ref('compress')

// Compress state
const compressFiles = ref<any[]>([])
const zipFileName = ref('')
const isCompressing = ref(false)
const compressProgress = ref(0)

// Decompress state
const singleZipFile = ref<any[]>([])
const isDecompressing = ref(false)
const decompressProgress = ref(0)
const unzippedFiles = ref<any[]>([])

// --- Compress Functions ---
const handleCompressChange = (file: any, fileList: any[]) => {
  compressFiles.value = fileList
}

const handleCompressRemove = (file: any, fileList: any[]) => {
  compressFiles.value = fileList
}

const doCompress = async () => {
  if (compressFiles.value.length === 0) return

  isCompressing.value = true
  compressProgress.value = 0

  try {
    const zip = new JSZip()

    compressFiles.value.forEach(fileItem => {
      const file = fileItem.raw
      zip.file(file.name, file)
    })

    const content = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    }, (metadata) => {
      compressProgress.value = Math.floor(metadata.percent)
    })

    let name = zipFileName.value.trim() || 'archive'
    if (!name.endsWith('.zip')) {
      name += '.zip'
    }

    saveAs(content, name)
    ElMessage.success('压缩完成并已下载！')
  } catch (error) {
    console.error(error)
    ElMessage.error('压缩过程中出现错误')
  } finally {
    isCompressing.value = false
    setTimeout(() => { compressProgress.value = 0 }, 3000)
  }
}

// --- Decompress Functions ---
const handleDecompressChange = (file: any, _fileList: any[]) => {
  singleZipFile.value = [file]
  unzippedFiles.value = []
  decompressProgress.value = 0
}

const doDecompress = async () => {
  if (singleZipFile.value.length === 0) return

  isDecompressing.value = true
  decompressProgress.value = 0
  unzippedFiles.value = []

  try {
    const file = singleZipFile.value[0].raw
    const zip = new JSZip()

    const loadedZip = await zip.loadAsync(file)

    const totalFiles = Object.keys(loadedZip.files).length
    let processed = 0
    let filesData: any[] = []

    for (const [filename, zipEntry] of Object.entries(loadedZip.files)) {
      if (!zipEntry.dir) {
        const u8 = await zipEntry.async("uint8array", (_metadata) => {
          // This is progress per file, to make it simple we use file count
        })
        filesData.push({
          name: filename,
          size: u8.length,
          data: u8
        })
      }
      processed++
      decompressProgress.value = Math.floor((processed / totalFiles) * 100)
    }

    unzippedFiles.value = filesData
    ElMessage.success('解压准备完成！您可以下载单个文件了。')
  } catch (error) {
    console.error(error)
    ElMessage.error('解压过程中出现错误，请确认是否为正确的ZIP文件')
  } finally {
    isDecompressing.value = false
  }
}

const downloadFile = (fileObj: any) => {
  const blob = new Blob([fileObj.data])
  saveAs(blob, fileObj.name.split('/').pop() || fileObj.name)
}
</script>

<style scoped>
.zip-tool {
  max-width: 800px;
  margin: 0 auto;
}
.operation-area {
  padding: 20px 0;
}
.action-bar {
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.mt-4 {
  margin-top: 20px;
}
</style>
