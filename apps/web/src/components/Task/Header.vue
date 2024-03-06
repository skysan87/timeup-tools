<script setup lang="ts">
import { TaskStateLabel, TaskState } from '@timeup-tools/core/value-object'
import TasklistDialog from '@/components/Tasklist/Dialog.vue'

const { getTaskCount, deleteDone, switchEdit, init, selectedState, currentListId, editMode } = useTaskStore()
const { getStateColor } = useStateColor()

interface Props {
  showMenu?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showMenu: false
})

const dialog = ref<InstanceType<typeof TasklistDialog>>()

/**
 * 完了済みのタスクを削除
 */
const deleteDoneTasks = () => {
  if (confirm('完了済みのタスクを削除しますか？')) {
    deleteDone()
  }
}

const openListDialog = async () => {
  await dialog.value?.openAsync({ tasklistId: currentListId.value, isCreateMode: false })
}

const reload = async () => {
  await init(currentListId.value)
}
</script>

<template>
  <div class="w-full flex items-center justify-center flex-wrap py-1">
    <label class="flex items-center">
      <span class="ml-1">Total</span>
      <span class="ml-1 badge" :class="getStateColor()">
        {{ getTaskCount() }}
      </span>
    </label>
    <label v-for="state in TaskState" :key="state" class="ml-2 flex items-center">
      <input v-model="selectedState" type="checkbox" :value="state">
      <span class="ml-1">{{ TaskStateLabel[state] }}</span>
      <span class="ml-1 badge" :class="getStateColor(state)">
        {{ getTaskCount(state) }}
      </span>
    </label>
    <button v-if="props.showMenu" class="btn btn-regular ml-2" ontouchend="" title="プロジェクトの詳細を表示する"
      @click="openListDialog">
      詳細
    </button>
    <TaskDropdownMenu v-if="props.showMenu" class="ml-2 dropdown-menu">
      <template #activator="{ open }">
        <button class="btn btn-outline" @click="open">
          メニュー
        </button>
      </template>
      <template #content="{ close }">
        <ul>
          <li v-if="props.showMenu">
            <p @click.left="deleteDoneTasks(), close()">
              <span class="icon">
                <fa :icon="['fas', 'trash-can']" class="text-gray-600" />
              </span>
              <span class="ml-2">完了済みのタスクを削除</span>
            </p>
          </li>
          <li v-if="props.showMenu">
            <p @click.left="switchEdit(), close()">
              <span class="icon">
                <fa :icon="['fas', 'edit']" class="text-gray-600" />
              </span>
              <span class="ml-2">編集モード: {{ editMode ? 'OFF' : 'ON' }}</span>
            </p>
          </li>
          <li v-if="props.showMenu">
            <p @click.left="reload(), close()">
              <span class="icon">
                <fa :icon="['fas', 'sync-alt']" class="text-gray-600" />
              </span>
              <span class="ml-2">リロード</span>
            </p>
          </li>
        </ul>
      </template>
    </TaskDropdownMenu>
  </div>
  <TasklistDialog ref="dialog" />
</template>

<style lang="scss" scoped>
.input-form {
  display: flex;
  width: 100%;
  padding: 15px 15px 5px 15px;
  max-width: 720px;
  margin: 0 auto;
}

.dropdown-menu {
  ul {
    margin: 0;
    padding: 0;
  }

  li {
    list-style: none;
    line-height: 1;
    padding: 5px 5px;
    cursor: pointer;

    &:hover {
      @apply bg-gray-200;
    }
  }

  p {
    color: rgb(66, 66, 66);
    text-decoration: none;
    font-size: 1.2rem;
  }

  .icon {
    display: inline-block;
    width: 1rem;
  }
}
</style>