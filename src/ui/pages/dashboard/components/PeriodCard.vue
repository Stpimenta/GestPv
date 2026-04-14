<script setup>
import { computed, onMounted, ref } from 'vue'
import { boolean } from 'zod'




const props = defineProps({

    initialDate: String,
    finalDate: String,
    createdBy: String,
    description: String,
    isBlocked: boolean,

})

const emit = defineEmits(['details', 'delete'])

const dynamicColor = computed(() => {
    if (props.isBlocked == null) return '#27c76a'
    return props.isBlocked ? '#FF4D40' : '#23E072'
})


</script>


<template>
    <div class="period-card">


        <div class="period-div-actions">


            <i class="pi pi-lock" :style="{ fontSize: '1.5rem', color: dynamicColor, }"></i>

            <div class="card-actions">
                <Button icon="pi pi-eye" severity="secondary" rounded @click="$emit('details')" />
            </div>

        </div>

        <div class="period-div-dates">
            <i class="pi pi-calendar"></i>
            <p class="p-period-dates">{{ initialDate + ' - ' + finalDate }}</p>
        </div>

        <div class="div-period-describe">
            <p class="p-muted-label">
                {{
                    description && description.trim()
                        ? (description.length > 40
                            ? description.slice(0, 35) + ' ...'
                            : description)
                : 'sem especificação'
                }}
            </p>
        </div>


        <div class="div-row"></div>


        <div class="div-period-describe">
            <p class="p-muted-label">
                {{ createdBy && createdBy.trim() ? createdBy : '-' }}
            </p>
        </div>

    </div>
</template>


<style scoped>
.period-card {
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: var(--bg-surface);
    width: 300px;
    height: 200px;
    padding-inline: 1rem;
    border-radius: 12px 12px 12px 12px;

    transition: none !important;
    justify-content: center;

}

.period-div-actions {
    display: flex;
    justify-content: space-between;
    height: 3rem;
    margin-bottom: 0.5rem;
    align-items: center;
}

.period-div-dates {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
    gap: 0.5rem;
}

.p-period-dates {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    margin: 0;
}



.period-div-dates i {
    font-size: 1.2rem;
    color: var(--p-primary-600);
}

.div-period-describe {
    display: flex;
    margin-top: 0.5rem;
}


.div-row {
    height: 0.1rem;
    width: 100%;

    margin-top: 0.5rem;
    margin-top: 0.5rem;
    background-color: var(--text-muted);
}


.p-muted-label {
    color: var(--text-muted);
    overflow: hidden;
}

</style>
