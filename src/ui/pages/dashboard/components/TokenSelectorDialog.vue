<script setup>
import { useMemberStore } from '@/stores/storeMember';
import { onMounted, reactive, ref, watch } from 'vue';
import debounce from "lodash-es/debounce";

const memberStore = useMemberStore();


//PROPS
const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    token: {
        type: String,
        required: true
    }
})

const emit = defineEmits([
    'update:visible',
    'update:token'
])


//COMPO FUNCTIONS
const close = () => {
    emit('update:visible', false)
}

const selectToken = (value) => {
    emit('update:token', value)
}

const onSelectMember = (member) => {
    selectToken(member.tokenContribuicao);
    close();
}

//SEARCH AND DEBOUNCE
const debounceSearch = debounce(async (value) =>{
    memberStore.resetMembers()
    await memberStore.fetchMembers({nome:value});
},500);

const searchInput = ref('');
watch(
    () => searchInput.value,
    async (value) =>{
        debounceSearch(value);
    }
)

// SENTINEL SCROOL
const sentinel = ref(null)
let observer = null

const setupObserver = () => {
    observer = new IntersectionObserver(
        async (entries) => {
            if (entries[0].isIntersecting) {
                await memberStore.fetchMembers()
            }
        },
        {
            root: document.querySelector('.dialog-list'),
            threshold: 0.1
        }
    )

    if (sentinel.value) observer.observe(sentinel.value)
}

//MOUNT
watch(
    () => props.visible,
    async (visible) => {
        if (visible) {
            observer?.disconnect()
            memberStore.resetMembers()
            await memberStore.fetchMembers()
            setupObserver()
        }
    }
)

</script>

<template>
    <Dialog :visible="props.visible" modal dismissableMask header="Edit Profile" :style="{ width: '25rem' }"
        @update:visible="emit('update:visible', $event)">
        <template #header>
            <div class="dialog-header">
                <i class="pi pi-search" style=""></i>
                <span class="font-bold whitespace-nowrap">Selecionar Usuário</span>
            </div>
        </template>

        <div class="dialog-body">

            <div class="search-input">
                <IconField>
                    <InputIcon class="pi pi-search" />
                    <InputText class="full-width" v-model="searchInput" placeholder="Search" />
                </IconField>
            </div>

            <div class="dialog-list">
                <div v-for="member in memberStore.data?.items || []" :key="member.id" @click="onSelectMember(member)"
                    class="dialog-member-card">
                    <div class="dialog-member-card-avatar-name">
                        <Avatar :label="member.nome.charAt(0)" class="mr-2" size="normal"
                            style="background-color: #058AA1; color: #FFFFFF" shape="circle" />
                        <p class="truncate">{{ member.nome }}</p>
                    </div>

                    <p>{{ member.tokenContribuicao }}</p>
                </div>

                <div ref="sentinel" class="sentinel"></div>

                <div v-if="memberStore.loading" class="loading">
                    <i class="pi pi-spin pi-spinner"></i>
                </div>

            </div>


        </div>

    </Dialog>
</template>

<style scoped>
.dialog-header {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem
}

.dialog-header i {
    font-size: 1.5rem;
    ;
}

.dialog-header span {
    font-weight: 600;
}

.search-input {
  width: 100%;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
}

.full-width{
    width: 100%;
}


.dialog-list {
    height: 250px;
    overflow-y: scroll;
}

.dialog-member-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    cursor: pointer;
    transition: background 0.15s ease;
    padding: 0.5rem;
    border-radius: 0.5rem;
}

.dialog-member-card:hover {
    background: var(--bg-hover);

}


.dialog-member-card-avatar-name {
    display: flex;
    align-items: center;
    gap: 1rem
}

.sentinel {
    height: 1px;
}

.loading {
    display: flex;
    justify-content: center;
    padding: .5rem;
}

.truncate {
    max-width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
