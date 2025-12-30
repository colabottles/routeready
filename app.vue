<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-gradient-start: #667eea;
  --bg-gradient-end: #764ba2;
  --text-primary: #1a202c;
  --text-secondary: #4a5568;
  --text-muted: #718096;
  --text-on-gradient: #ffffff;
  --input-bg: #ffffff;
  --input-border: #e2e8f0;
  --input-focus: #667eea;
  --input-text: #1a202c;
  --button-primary: #667eea;
  --button-primary-hover: #5a67d8;
  --error-bg: #fff5f5;
  --error-border: #feb2b2;
  --error-text: #c53030;
  --success-bg: #f0fff4;
  --success-border: #9ae6b4;
  --success-text: #2f855a;
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --toggle-bg: #ffffff;
  --toggle-border: #e2e8f0;
  --toggle-color: #4a5568;
}

:root[data-theme="dark"] {
  --bg-primary: #1a202c;
  --bg-secondary: #2d3748;
  --bg-gradient-start: #4c51bf;
  --bg-gradient-end: #434190;
  --text-primary: #f7fafc;
  --text-secondary: #e2e8f0;
  --text-muted: #a0aec0;
  --text-on-gradient: #ffffff;
  --input-bg: #2d3748;
  --input-border: #4a5568;
  --input-focus: #667eea;
  --input-text: #f7fafc;
  --button-primary: #667eea;
  --button-primary-hover: #5a67d8;
  --error-bg: #742a2a;
  --error-border: #c53030;
  --error-text: #feb2b2;
  --success-bg: #22543d;
  --success-border: #2f855a;
  --success-text: #9ae6b4;
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  --toggle-bg: #2d3748;
  --toggle-border: #4a5568;
  --toggle-color: #e2e8f0;
}

* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
</style>