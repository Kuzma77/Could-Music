<template>
  <div>
    <h3>歌单管理</h3>
    <mu-auto-complete :data="names" label="搜索" :max-search-results="10" v-model="search" open-on-focus avatar>
      <template slot-scope="scope">
        {{ scope.item.substring(0, 1) }}
        <mu-list-item-content v-html="scope.highlight"></mu-list-item-content>
      </template>
    </mu-auto-complete>
    <span v-for="(item, index) in menus" :key="index" class="gutter">
      <mu-button color="teal" v-if="item.title === '搜索'">搜索</mu-button>
      <mu-button color="error" v-if="item.title === '导出'">导出</mu-button>
      <mu-button color="success" v-if="item.title === '新增'">创建</mu-button>
      <mu-button color="error" v-if="item.title === '删除'">删除</mu-button>
    </span>
    <v-data-iterator :items="allItems" :items-per-page.sync="itemsPerPage" :page="page" :search="search" hide-default-footer>
      <template v-slot:default="props">
        <mu-row>
          <mu-col span="4" v-for="item in props.items" :key="item.songListId"
            ><div class="grid-cell">
              <template>
                <v-card class="mx-auto" max-width="400" min-height="400" style="margin:5px">
                  <v-img class="white--text align-end" height="200px" :src="item.thumbnail"> </v-img>
                  <v-card-title class="subheading font-weight-bold">{{ item.songListName }}</v-card-title>
                  <v-card-text class="text--primary">
                    <div>歌曲数：{{ item.songCount }}</div>
                    <div>收藏数：{{ item.likeCount }}</div>
                    <div>播放量：{{ item.playCounts }}</div>
                  </v-card-text>
                  <v-card-actions>
                    <mu-dialog title="该歌单里歌曲" width="360" scrollable :open.sync="openScroll">
                      <v-list-item v-for="song in songs" :key="song.songId" :inactive="inactive">
                        <v-list-item-title>歌名：{{ song.songName }}</v-list-item-title>
                      </v-list-item>
                    </mu-dialog>
                    <v-btn color="green" @click="showSongs(item.songListId)" text>
                      Enter
                    </v-btn>
                    <v-btn color="orange" @click="exportSongs(item.songListId)" text>
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
        <mu-flex justify-content="center">
          <mu-pagination :total="items.totalPage" :current.sync="page"></mu-pagination>
        </mu-flex>
      </template>
    </v-data-iterator>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuList: this.$store.state.menuList,
      names: [],
      menus: [],
      search: '',
      filter: {},
      page: 1,
      itemsPerPage: 6,
      items: [],
      allItems: [],
      openScroll: false,
      songListId: '',
      songs: [],
      chooseSongId: []
    }
  },
  computed: {
    filteredKeys() {
      return this.keys.filter((key) => key !== ``)
    }
  },
  methods: {
    pageChange() {
      this.axios({
        method: 'post',
        url: this.GLOBAL.baseUrl + '/songList/getByPage',
        data: {
          currentPage: this.page,
          pageSize: this.itemsPerPage
        }
      }).then((res) => {
        console.log(res)
        this.items = res.data.data
        console.log(this.items)
      })
    },
    showSongs(id) {
      this.openScroll = true
      this.songListId = id
      this.axios({
        method: 'get',
        url: this.GLOBAL.baseUrl + '/songList/getSongList',
        params: {
          songListId: this.songListId
        }
      }).then((res) => {
        this.songs = res.data.data.songs
      })
    },
    exportSongs(id) {
      this.$confirm('确定要导出？', '提示').then(({ result }) => {
        if (result) {
          this.songListId = id
          this.axios({
            method: 'get',
            url: this.GLOBAL.baseUrl + '/resources/songs',
            params: {
              songListId: this.songListId
            },
            responseType: 'blob'
          }).then((res) => {
            const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
            const downLoad = document.createElement('a')
            const href = window.URL.createObjectURL(blob)
            downLoad.href = href
            downLoad.download = '歌曲数据表' + id
            document.body.appendChild(downLoad)
            downLoad.click()
            document.body.removeChild(downLoad)
            window.URL.revokeObjectURL(href)
          })
        }
      })
    }
  },
  created() {
    for (let i = 0; i < this.menuList.length; i++) {
      let parent = this.menuList[i]
      for (let j = 0; j < parent.subMenus.length; j++) {
        let child = this.menuList[i]
        if (child.subMenus[j].path === this.$options.name) {
          this.menus = child.subMenus[j].subMenus
        }
      }
    }
    this.axios({
      method: 'post',
      url: this.GLOBAL.baseUrl + '/songList/getByPage',
      data: {
        currentPage: this.page,
        pageSize: this.itemsPerPage
      }
    }).then((res) => {
      this.items = res.data.data
    })
    this.axios({
      method: 'get',
      url: this.GLOBAL.baseUrl + '/songList/all'
    }).then((res) => {
      this.allItems = res.data.data
      this.allItems.forEach((item) => {
        this.names.push(item.songListName)
      })
    })
  },
  watch: {
    page: 'pageChange'
  }
}
</script>
