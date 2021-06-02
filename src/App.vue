<template>
  <div id="app">
    <h1>HelloAlexCc</h1>
    <div class="search-bar">
      <input type="text" @keyup.enter="addList" v-model="value" @input="handleInput(value)" @blur="handleBlur" placeholder="添加或搜索"/>
      <button @click="addList">+</button>
    </div>
    <div class="operation">
      <span class="all" @click="handleSelect('all')" :class="{selected: type === 'all'}">全部</span>
      <span class="yes" @click="handleSelect('completed')" :class="{selected: type === 'completed'}">已完成</span>
      <span class="no" @click="handleSelect('active')" :class="{selected: type === 'active'}">未完成</span>
    </div>
    <ul class="list-wrap">
      <li v-for="(item, i) in list" :key="item.id" :class="{checked: item.completed}" @dblclick="editing(item)">
        <div class="row">
          <input
          class="check"
          type="checkbox"
          v-model="item.completed"
          @change="handleChange(item)"
        ></input>
        <span class="text">{{ item.title }}</span>
        <button @click="removeList(item)">删除</button>
        </div>
        <input type="text" v-model="item.title" class="edit" v-show="item.id === editingID" @blur="editBlur" @keyup.enter="edited(item)" @keyup.esc="cancelEdit">
      </li>
    </ul>
  </div>
</template>

<script>
import * as api from "./util/localstorage";
import { mapState } from "vuex";
export default {
  data() {
    return {
      value: "",
      list: api.get(),
      timer: null,
      type: "all",
      editingID: "",
    };
  },
  computed: {
    ...mapState(["content"]),
  },
  methods: {
    // 添加一项
    async addList() {
      if (!this.value.trim()) {
        return;
      }
      const res = await this.$store.dispatch("addContent", {
        title: this.value,
        id: api.getUID(),
        completed: false,
      });
      this.list = res;
      this.value = "";
    },
    // 删除一项
    async removeList(value) {
      const res = await this.$store.dispatch("remContent", value);
      this.list = res;
    },
    // 搜索并防抖处理
    handleInput(value) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.list = this.list.filter((item) => {
          return item.title.indexOf(value) > -1;
        });
        if (!this.list) {
          this.list = [];
        }
      }, 1000);
    },
    // 失去焦点
    handleBlur() {
      this.list = api.get();
    },
    // 复选框的状态改变
    handleChange(item) {
      this.list = this.list.map((i) => {
        if (i.id === item.id) {
          return {
            ...i,
            completed: item.completed,
          };
        } else {
          return {
            ...i,
          };
        }
      });
      this.$store.dispatch("setContent", this.list);
    },
    // 旋转按钮
    handleSelect(value) {
      this.type = value;
      this.list = api.filter(this.content, this.type);
    },
    // 编辑ing
    editing(item) {
      this.editingID = item.id;
    },
    // 失去编辑焦点
    editBlur() {
      this.editingID = 0;
      this.$store.dispatch("setContent", this.list);
    },
    // 完成编辑
    edited() {
      this.editBlur()
    },
    cancelEdit() {
      this.editBlur();
    }
  },
};
</script>

<style lang="less">
#app {
  width: 500px;
  margin: 50px auto;
  padding: 15px 30px;
  background-color: #eee;
  border-radius: 10px;
  h1 {
    margin: 0;
  }
  .search-bar {
    margin-top: 20px;
    position: relative;
    input {
      width: 100%;
      height: 30px;
      border-radius: 25px;
      padding: 5px 5px;
      outline: none;
      border: none;
    }
    button {
      position: absolute;
      right: -13px;
      top: 0px;
      height: 42px;
      width: 42px;
      border-radius: 50%;
      font-size: 30px;
      background-color: #4e6ef2;
      color: #fff;
      border: none;
      cursor: pointer;
    }
  }
  .operation {
    margin-top: 20px;
    span {
      display: inline-block;
      margin-right: 10px;
      cursor: pointer;
      &.selected {
        color: #4e6ef2;
      }
    }
  }
  .list-wrap {
    margin: 0;
    list-style: none;
    padding: 0;
    li {
      padding: 5px 30px;
      border-radius: 10px;
      margin-top: 10px;
      position: relative;
      background-color: #fff;
      &.checked .text {
        text-decoration: line-through;
      }
      .check {
        display: inline-block;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        position: absolute;
        top: 7px;
        left: 5px;
        border: 2px solid #4e6ef2;
        cursor: pointer;
        box-sizing: border-box;
        padding: 4px;
        &.active {
          background-color: #4e6ef2;
        }
      }
      .text {
        font-weight: 400;
        word-break: break-all;
      }
      button {
        position: absolute;
        right: 7px;
        top: 5px;
        cursor: pointer;
        background-color: red;
        color: #fff;
        border: none;
        border-radius: 8px;
      }
    }
  }
}
.edit {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 15px;
  border: 1px solid #e42562;
  outline: none;
}
</style>
