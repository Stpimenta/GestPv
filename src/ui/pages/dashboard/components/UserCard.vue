<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import {roleConfig}  from '../mapping/roles'
const props = defineProps({
    name: { type: String, required: true },
    email: { type: String, required: true },
    token: { type: String, required: true },
    role: { type: String, default: 'user' },
    avatarLabel: { type: String, default: 'U' }
})

const emit = defineEmits(['details', 'delete'])



const currentRole = computed(() => roleConfig[props.role] ?? roleConfig.membro)

const limitedName = computed(() => {
  const maxLength = 22
  return props.name.length > maxLength ? props.name.slice(0, maxLength) + '...' : props.name
})

const limitedEmail = computed(() => {
  const maxLength = 28
  return props.email.length > maxLength ? props.email.slice(0, maxLength) + '...' : props.email
})


</script>

<template>
    <div class="body-card">

        <div class="card-informations">
            <div class="card-avatar">
                <Avatar :label="avatarLabel" size="large" shape="circle"
                    style="background-color: #058AA1; color: #FFFFFF" />
            </div>

            <div class="info-wrapper">
                <div class="card-name-function">
                    <p class="p-name">{{ limitedName }}</p>

                    <div class="card-function" :style="{
                        background: currentRole.bg,
                        border: `1px solid ${currentRole.border}`
                    }">
                        <i :class="currentRole.icon" :style="{ color: currentRole.color }"></i>
                        <p :style="{ color: currentRole.color }">
                            {{ role }}
                        </p>
                    </div>
                </div>

                <div class="card-email-token">
                    <div class="card-token">
                        <span class="pi pi-key muted"></span>
                        <p class="muted">{{ token }}</p>
                    </div>

                    <p class="muted">{{ limitedEmail }}</p>
                </div>
            </div>
        </div>

        <div class="div-card-buttons">
            <Button label="Detalhes" severity="info" icon="pi pi-user-edit" variant="text" class="card-buttons"
                @click="emit('details')" />
            <Button label="Excluir" icon="pi pi-trash" severity="danger" variant="text" class="card-buttons"
                @click="emit('delete')" />
        </div>

    </div>
</template>

<style scoped>
.body-card {
    min-height: 6rem;
    width: 70%;
    display: flex;
    flex-wrap: wrap;
    background-color: var(--bg-surface);
    border-radius: 0.8rem;
    padding: 1rem;
    gap: 1rem;
}

.card-informations {
    width: 65%;
    display: flex;
    align-items: center;
}

.info-wrapper {
    width: 100%;
}

.div-card-buttons {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 1rem;
    width: 30%;
}

.card-buttons {
    height: 2rem;
}

.card-avatar {
    margin-right: 1rem;
}

.card-name-function {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.4rem;
    align-items: center;
}

.card-email-token {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
}

.card-token {
    display: flex;
    gap: 0.2rem;
    margin-right: 0.8rem;
}

.card-function {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
}

.card-function i {
    font-size: 0.75rem;
}

.card-function p {
    margin: 0;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.3px;
}

.p-name {
    font-size: 1.2rem;
    font-weight: 580;
}

.muted {
    color: var(--text-muted);
}

@media (max-width: 1024px) {
    .body-card {
        width: 90%;
    }
}

@media (max-width: 640px) {
    .body-card {
        width: 100px;
    }

    .div-card-buttons {
        width: 100%;
    }
}
</style>