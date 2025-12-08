<script setup lang="ts">
import { AdobePhotoshop } from '@icon-park/vue-next'
import { Button, Dropdown, Menu, Divider, type MenuProps } from 'ant-design-vue'
import { DownOutlined } from '@ant-design/icons-vue'

const handleBtnClick = (e: Event) => {
  console.log('click left button', e)
}

const handleMenuClick: MenuProps['onClick'] = e => {
  console.log('click', e)
}
</script>

<template>
  <div class="header-left">
    <div class="left-icon">
      <adobe-photoshop :size="30" />
    </div>
    <div class="left-title">
      <span class="title-text">图片编辑器</span>
    </div>
  </div>
  <Divider class="vertical-divider" type="vertical" />
  <div class="header-center">
    <Dropdown>
      <template #overlay>
        <Menu @click="handleMenuClick">
          <Menu.Item key="file">
            <span>文件</span>
          </Menu.Item>
          <Menu.Item key="edit">
            <span>编辑</span>
          </Menu.Item>
          <Menu.Item key="view">
            <span>视图</span>
          </Menu.Item>
        </Menu>
      </template>
      <Button class="menu-trigger" @click="handleBtnClick">
        上传
        <DownOutlined />
      </Button>
    </Dropdown>
  </div>
  <Divider class="vertical-divider" type="vertical" />
  <div class="header-right">
    <Button @click="handleBtnClick"> 导出 </Button>
  </div>
</template>

<style scoped lang="less">
.header-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .left-icon {
    margin-right: 4px;
    cursor: pointer;
  }

  .left-title {
    .title-text {
      font-size: 22px;
      font-weight: bold;
      cursor: pointer;
    }
  }
}

.header-center {
  display: flex;
  flex: 2;
  align-items: center;
  justify-content: flex-start;
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.vertical-divider {
  height: 100%;
}
</style>
