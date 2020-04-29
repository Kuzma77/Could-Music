<template>
  <div>
    <h3>歌曲类型管理</h3>
    <span v-for="(item, index) in menus" :key="index" class="gutter">
      <mu-button color="teal" v-if="item.title === '搜索'">搜索</mu-button>
      <mu-button color="error" v-if="item.title === '排序'">排序</mu-button>
      <mu-button color="success" v-if="item.title === '新增'">新建</mu-button>
      <mu-button color="error" v-if="item.title === '删除'" @click="openScroll = true">删除</mu-button>
    </span>
    <mu-dialog title="Choose One" width="360" scrollable :open.sync="openScroll">
      <mu-list>
        <mu-list-item v-for="type in types" :key="type" v-show="type.delete_flag == 0">
          <mu-list-item-content>
            <mu-radio :label="type.type_name" :value="type.type_name" v-model="DelTypeName"></mu-radio>
          </mu-list-item-content>
        </mu-list-item>
      </mu-list>
      <!-- <mu-button class="demo-button" color="teal" @click="prompt()">Prompt</mu-button> -->
      <mu-button slot="actions" flat color="error" @click="confirm()">del</mu-button>
    </mu-dialog>
    <template>
      <v-row justify="space-around">
        <v-col cols="12" sm="18" md="15" lg="30">
          <v-sheet elevation="10" class="pa-4" style="padding:15px">
            <h2 class="title mb-2">All Type</h2>
            <v-chip-group column active-class="primary--text">
              <v-chip v-for="(type, index) in types" :key="index" :value="index" @click="showList(index)" v-show="type.delete_flag == 0">
                {{ type.type_name }}
                <!-- <v-icon dense medium>mdi-minus</v-icon> -->
              </v-chip>
              <v-chip @click="openSimple = true"><v-icon dense medium>mdi-plus</v-icon>添加</v-chip>
            </v-chip-group>
            <mu-dialog title="typeName:" width="360" :open.sync="openSimple">
              <mu-text-field v-model="typeName" placeholder="最多不超过5个字符" :max-length="5"></mu-text-field><br />
              <mu-button slot="actions" flat color="primary" @click="addtype()">ADD</mu-button>
            </mu-dialog>
          </v-sheet>
        </v-col>
      </v-row>
    </template>
    <mu-row>
      <mu-col span="3" v-for="(song_list, index) in types[typeId].song_lists" :key="index"
        ><div class="grid-cell">
          <template>
            <v-card class="mx-auto" max-width="400" style="margin:5px">
              <v-img class="white--text align-end" height="200px" :src="song_list.thumbnail"> </v-img>

              <v-card-subtitle class="pb-0">{{ song_list.songListName }}</v-card-subtitle>

              <v-card-text class="text--primary">
                <div>歌曲数：{{ song_list.songCount }}</div>

                <div>收藏数：{{ song_list.likeCount }}</div>
              </v-card-text>

              <v-card-actions>
                <v-btn color="green" text>
                  Enter
                </v-btn>

                <v-btn color="orange" text>
                  Explore
                </v-btn>

                <v-btn color="red" text>
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </div></mu-col
      >
    </mu-row>
  </div>
</template>

<script>
export default {
  name: 'MusicType',
  data() {
    return {
      search: '',
      menuList: this.$store.state.menuList,
      menus: [],
      types: [],
      typeId: 0,
      openSimple: false,
      openScroll: false,
      typeName: '',
      DelTypeName: ''
    }
  },
  created() {
    for (let i = 0; i < this.menuList.length; i++) {
      let parent = this.menuList[i]
      for (let j = 0; j < parent.subMenus.length; j++) {
        let child = this.menuList[i]
        if (child.subMenus[j].path === this.$options.name) {
          this.menus = child.subMenus[j].subMenus
          console.log(JSON.stringify(this.menus))
        }
      }
    }
    //获取所有歌曲
    this.axios.get(this.GLOBAL.baseUrl + '/songType/all').then((res) => {
      this.types = res.data.data
    })
  },
  methods: {
    showList(Id) {
      this.typeId = Id
    },
    addtype() {
      this.axios({
        method: 'post',
        url: this.GLOBAL.baseUrl + '/songType/add',
        params: {
          typeName: this.typeName
        }
      }).then((res) => {
        if (res.data.msg === '成功') {
          this.typeName = ''
          this.openSimple = false
          this.axios.get(this.GLOBAL.baseUrl + '/songType/all').then((res) => {
            this.types = res.data.data
          })
        } else {
          alert('添加失败')
        }
      })
    },
    confirm() {
      this.$confirm('确定要删除？', '提示', {
        type: 'error'
      }).then(({ result }) => {
        if (result) {
          this.axios({
            method: 'delete',
            url: this.GLOBAL.baseUrl + '/songType/delete',
            params: {
              typeName: this.DelTypeName
            }
          }).then((res) => {
            if (res.data.msg === '成功') {
              this.openScroll = false
              this.axios.get(this.GLOBAL.baseUrl + '/songType/all').then((res) => {
                this.types = res.data.data
              })
            } else {
              alert('添加失败')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
