<template>
  <div style="padding-top:10px;">
    <v-row>
      <v-col md="6" class="d-flex flex-row">
        <v-text-field v-model="keywords" :counter="10" label="keywords" required></v-text-field>
        <v-btn v-for="(item, index) in menus" :key="index" :color="item.icon" class="mr-3" @click="handleClick(item.title)" large>
          {{ item.title }}
        </v-btn>
      </v-col>
    </v-row>
    <v-card>
      <v-card-title>
        Nutrition
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="desserts" :search="search"></v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Music',
  data() {
    return {
      menus: [],
      menuList: this.$store.state.menuList,
      search: '',
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' }
      ],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%'
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%'
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%'
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%'
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%'
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%'
        }
      ]
    }
  },
  created() {
    console.log(this.$options.name)
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
  },
  methods: {
    handleClick(title) {
      if (title === '新增') {
        this.add()
      }
      if (title === '搜索') {
        this.searchs()
      }
      if (title === '导入') {
        this.import()
      }
      if (title === '导出') {
        this.export()
      }
    },
    add() {
      alert('新增歌曲')
    },
    searchs() {
      alert('搜索歌曲')
    },
    export() {
      alert('导出歌曲')
    },
    import() {
      alert('导入歌曲')
    }
  }
}
</script>

<style scoped lang="scss"></style>
