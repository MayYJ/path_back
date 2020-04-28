<template>
  <div class="from">
    <div class="templateImportBox">
      <el-button type="primary" @click="centerDialogVisible = true">
        模板导入
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
    </div>
    <!-- 中心点 -->
    <!-- <div class="templateImportBox">
      <el-tag class="editor" @click="handleOpenConfigCenterNode">设置中心点</el-tag>
    </div>-->
    <el-dialog title="设置中心点服务点" :visible.sync="dialogVisible">
      <el-transfer
        class="transfer"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入地点名"
        v-model="rightValue"
        :data="data2"
        :titles="['服务点', '中心点']"
        @change="centerChange"
      ></el-transfer>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
      </span>
    </el-dialog>

    <el-dialog
      title="导入操作 "
      :visible.sync="centerDialogVisible"
      width="30%"
      center
      style="font-family:PingFang SC"
    >
      <div style="margin-bottom: 20px;">
        <span>点击<a :href="$url + '/node/downloadNodeFile'">下载</a></span>点模板文件
      </div>
      <el-divider></el-divider>
      <div>
          <el-upload
          class="upload-demo"
          ref="upload"
          :action="excelUp"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          :on-change="handleChange"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
          >上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">上传文件</div>
        </el-upload>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-table
      :data="tableData"
      ref="multipleTable"
      style="cursor: pointer;width: 900px;margin:0px auto;"
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column label="地址名称" width="140">
        <template slot-scope="scope">
          <span @click="toSingePoint(scope.row)">{{ scope.row.nodeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址描述" width="200">
        <template slot-scope="scope">
          <!-- <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.name }}</p>
            <p>住址: {{ scope.row.address }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>-->
          <span @click="toSingePoint(scope.row)">{{ scope.row.nodeAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经度" width="100">
        <template slot-scope="scope">
          <span @click="toSingePoint(scope.row)">{{ scope.row.lng }}</span>
        </template>
      </el-table-column>
      <el-table-column label="纬度" width="100">
        <template slot-scope="scope">
          <span @click="toSingePoint(scope.row)">{{ scope.row.lat }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column type="selection" width="30"></el-table-column> -->
      <el-table-column label="是否为中心点" width="120px">
        <template slot-scope="scope">
          <span @click="toSingePoint(scope.row)">{{ isCenter(scope.row.isCenter) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
          <div>
            <el-button
              size="mini"
              type="primary"
              :class="{'not-show': scope.row.isCenter === 1}"
              @click="updateNode(scope.$index, 1)"
            >设为中心点</el-button>
            <el-button
              size="mini"
              type="primary"
              :class="{'not-show': scope.row.isCenter === 0}"
              @click="updateNode(scope.$index, 0)"
            >设为服务点</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="display: flex;justify-content: center;margin-top:40px;"
      class="pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="prev, pager, next, jumper"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      :total="total"
    ></el-pagination>
    <footer-footer />
  </div>
</template>

<script>
import FooterFooter from "./Footer.vue"
export default {
  name: "Index",
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      excelUp: "", // excel导点
      centerDialogVisible: false,
      dialogVisible: false, // 中心点
      data2: [],
      rightValue: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1
      },
      centerPoint: [],
      serverPoint: [],
      checked: false,
      multipleSelection: [],
      questionId: "",
      tableData: [],
      fileList: [
        // {
        //   name: "food.jpeg",
        //   url:
        //     "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        // },
        // {
        //   name: "food2.jpeg",
        //   url:
        //     "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        // }
      ]
    }
  },
  components: {
    FooterFooter
  },
  methods: {
    // handleEdit (index, row) {
    //   console.log(index, row)
    // },
    /*
删除项目
*/
    handleDelete(index, row) {
      let that = this
      console.log(index, row)
      console.log(this.tableData[index])
      this.$axios
        .delete(that.$url + "/node/deleteNode", {
          params: {
            questionId: that.questionId,
            nodeId: that.tableData[index].nodeId
          }
        })
        .then(function(response) {
          console.log(response)
          if (response.data.status === 0) {
            that.$notify({
              title: "成功",
              message: "点" + that.tableData[index].nodeName + "删除成功",
              type: "success"
            })
            that.tableData.splice(index, 1)
          } else {
            that.$notify({
              title: "警告",
              message: response.data.msg,
              type: "warning"
            })
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    /*
添加项目
*/
    // addPrograme(value) {
    //   console.log(value);
    //   this.tableData.unshift(value);
    // },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      let that = this
      that.$axios
        .get(that.$url + "/node/getQuestionNodes", {
          params: {
            questionId: that.questionId,
            currentPage: that.currentPage,
            pageSize: that.pageSize
          }
        })
        .then(res => {
          if (res.data.status === 0) {
            that.tableData = res.data.object
          } else {
            that.$notify({
              title: "警告",
              message: res.data.msg,
              type: "warning"
            })
          }
          console.log(res)
          that.tableData = res.data.object
        })
        .then(data => {})
    },
    /*
跳转准备数据界面
*/
    prepareData(index, row) {
      console.log(index, row)
      this.$router.push({ path: "/DataPerpare", query: { id: "1" } })
    },
    // 文件上传函数
    submitUpload() {
      console.log()
      this.$refs.upload.submit()
    },
    handleChange(file, fileList) {
      let that = this
      this.fileList = fileList.slice(-3)
      console.log(that.fileList)
      if (that.fileList[0].status === "success") {
        if (that.fileList[0].response.status === 0) {
          that.getAllpoinit()
        }
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },

    // 获取该问题下面所有点信息
    getAllpoinit() {
      let that = this
      this.$axios
        .get(this.$url + "/node/getQuestionNodes", {
          params: {
            questionId: that.questionId,
            currentPage: that.currentPage,
            pageSize: that.pageSize
          }
        })
        .then(res => {
          if (res.data.status === 0) {
            // 显示为服务点
            that.total = res.data.total
            for (let i in that.tableData) {
              if (that.tableData[i].isCenter === 1) {
                that.rightValue.push(parseInt(i))
              }
            }
          } else {
            that.$notify({
              title: "警告",
              message: res.data.msg,
              type: "warning"
            })
          }
          console.log(res)
          that.tableData = res.data.object
        })
        .then(data => {})
    },
    handleOpenConfigCenterNode() {
      console.log("get rightValue")
      console.log(this.rightValue)
      if (this.data2.length === 0) {
        this.generateData2(this.tableData)
      }
      if (this.rightValue.length === 0) {
        console.log("config rightValue")
        this.initailRightValue()
      }
      this.dialogVisible = true
    },
    // 初始化rightValue数据
    initailRightValue() {
      let rightValue = []
      for (let i in this.tableData) {
        if (this.tableData[i].isCenter === 1) {
          rightValue.push(parseInt(i))
        }
      }
      this.rightValue = rightValue
    },
    // 获得点数据
    getTableData() {
      this.$axios
        .get(this.$url + "/node/getQuestionNodes", {
          params: {
            questionId: this.questionId,
            currentPage: this.currentPage,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          if (res.data.status === 0) {
            this.tableData = res.data.object
          }
        })
    },
    // 是否为中心点
    isCenter(value) {
      return value === 0 ? "否" : "是"
    },
    // 中心点遮罩层
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    generateData2(arr) {
      console.log("得到数据")
      console.log(arr)
      let data = []
      // let cities = ["上海", "北京", "广州", "深圳", "南京", "西安", "成都"];
      let cities = []
      for (let i in arr) {
        cities.push(arr[i].nodeName)
      }
      let pinyin = cities
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index]
        })
      })
      this.data2 = data
    },
    setCenter() {
      this.getAllpoinit()
      this.dialogVisible = true
      this.generateData2(this.tableData)
    },
    centerChange(value, direction, movedKeys) {
      if (direction === "right") {
        console.log("设置中心点")
        this.changeCenter(movedKeys)
      } else {
        console.log("设置服务点")
        this.changeServer(movedKeys)
      }
    },
    updateNode(indexKey, isCenter) {
      let that = this
      let row = this.tableData[indexKey]
      let tableData = this.tableData
      this.$axios
        .patch(
          this.$url + "/node/updateNode",
          that.$qs.stringify({
            nodeId: row.nodeId,
            questionId: that.questionId,
            nodeName: row.nodeName,
            nodeAddress: row.nodeAddress,
            lat: row.lat,
            lng: row.lng,
            isCenter: isCenter
          })
        )
        .then(res1 => {
          if (res1.data.status === 0) {
            that.$notify({
              title: "成功",
              message: "点" + row.nodeName + "设置成功",
              type: "success"
            })
            tableData[indexKey].isCenter === 0
              ? (tableData[indexKey].isCenter = 1)
              : (tableData[indexKey].isCenter = 0)
          } else {
            that.$notify({
              title: "警告",
              message: res1.data.msg,
              type: "warning"
            })
          }
        })
        .catch(function(error) {
          this.$notify.error({
            title: "错误",
            message: "请刷新界面重新设置"
          })
        })
    },
    // 变为中心点
    changeCenter(movedKeys) {
      let that = this
      for (let i in movedKeys) {
        console.log(movedKeys[i])
        that.updateNode(movedKeys[i], "1")
      }
    },
    // 变为服务点
    changeServer(movedKeys) {
      let that = this
      for (let i in movedKeys) {
        console.log(movedKeys[i])
        that.updateNode(movedKeys[i], "0")
      }
    },
    // 查看单一点
    toSingePoint(row) {
      this.$router.push({
        path: "/SinglePoint",
        query: {
          lat: row.lat,
          lng: row.lng,
          nodeAddress: row.nodeAddress
        }
      })
    },
    downloadNodeTemplate() {
      let that = this
      that.$axios
        .get(that.$url + "/node/downloadNodeFile", { responseType: "blob" })
        .then(res => {
          const content = res
          const blob = new Blob([content])
          const fileName = "测试表格123.xlsx"
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a")
            elink.download = fileName
            elink.style.display = "none"
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
    }
  },
  beforeCreate() {},
  mounted() {
    let that = this
    that.excelUp = that.$url + "/node/excelNodeInfo/" + this.$route.query.id
    console.log(that.excelUp)
    that.questionId = this.$route.query.id
    that.getAllpoinit()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.from {
  margin: 0px 100px;
}
.mouseIn {
  cursor: pointer;
}
.templateImportBox {
  /* position: absolute;
  left: 50px;
  width: 250px;
  height: 200px;
  top: 100px;
  margin: 0px auto;
  display: flex;
  justify-content: flex-start;
  z-index: 2; */
  width: 800px;
  margin: 0px auto;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.editor {
  cursor: pointer;
}
.pagination {
  margin-top: 30px;
  margin-bottom: 100px;
}
.el-button + .el-button {
  margin-left: 0px;
}
</style>
