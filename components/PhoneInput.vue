<template>
  <div class="phone-input-wrapper">
    <div class="phone-field">
      <select
        :id="`${id}-format`"
        v-model="selectedFormat"
        class="phone-format-select"
        :aria-label="`Phone format for ${label}`"
        @change="handleFormatChange">
        <option value="us">🇺🇸 US</option>
        <option value="international">🌐 Intl</option>
      </select>
      <input
        :id="id"
        :value="modelValue"
        type="tel"
        class="form-input phone-input"
        :placeholder="phonePlaceholder(selectedFormat)"
        :pattern="phonePattern(selectedFormat)"
        :required="required"
        :autocomplete="autocomplete"
        @input="handleInput"
        @blur="handleBlur">
    </div>
    <p class="phone-hint">
      {{ selectedFormat === 'us' ? 'US format: (555) 123-4567' : 'International: +1 555 123 4567' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePhoneFormat, type PhoneFormat } from '~/composables/usePhoneFormat'

const props = withDefaults(defineProps<{
  id: string
  label: string
  modelValue: string
  required?: boolean
  autocomplete?: string
}>(), {
  required: false,
  autocomplete: 'tel'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { formatPhone, phonePlaceholder, phonePattern } = usePhoneFormat()
const selectedFormat = ref<PhoneFormat>('us')

function handleInput(event: Event) {
  const input = event.target as HTMLInputElement
  const formatted = formatPhone(input.value, selectedFormat.value)
  input.value = formatted
  emit('update:modelValue', formatted)
}

function handleBlur(event: Event) {
  const input = event.target as HTMLInputElement
  const formatted = formatPhone(input.value, selectedFormat.value)
  emit('update:modelValue', formatted)
}

function handleFormatChange() {
  // Re-format existing value when switching formats
  if (props.modelValue) {
    emit('update:modelValue', formatPhone(props.modelValue, selectedFormat.value))
  }
}
</script>

<style scoped>
.phone-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.phone-field {
  display: flex;
  gap: 0;
}

.phone-format-select {
  padding: 0.75rem 0.5rem;
  border: 1.5px solid var(--input-border);
  border-right: none;
  border-radius: 8px 0 0 8px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
}

.phone-format-select:focus {
  outline: none;
  border-color: var(--input-focus);
}

.phone-input {
  border-radius: 0 8px 8px 0;
  flex: 1;
}

.phone-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}
</style>