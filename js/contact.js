/* ============================================================
   CONTACT FORM — Validation + submission
   Feature: 008-perfume-static-site
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form       = document.getElementById('contact-form');
  const successDiv = document.getElementById('form-success');
  const resetBtn   = document.getElementById('btn-send-another');

  if (!form) return;

  // Real-time validation on blur
  ['name', 'email', 'message'].forEach(field => {
    const input = form.querySelector(`[name="${field}"]`);
    if (input) {
      input.addEventListener('blur', () => {
        const err = validateField(field, input.value);
        err ? showError(field, err) : clearError(field);
      });
      input.addEventListener('input', () => {
        if (getGroupEl(field)?.classList.contains('has-error')) {
          const err = validateField(field, input.value);
          err ? showError(field, err) : clearError(field);
        }
      });
    }
  });

  // Form submit
  form.addEventListener('submit', e => {
    e.preventDefault();
    let hasErrors = false;
    let firstErrorField = null;

    ['name', 'email', 'message'].forEach(field => {
      const input = form.querySelector(`[name="${field}"]`);
      const err   = validateField(field, input?.value || '');
      if (err) {
        showError(field, err);
        hasErrors = true;
        if (!firstErrorField) firstErrorField = input;
      } else {
        clearError(field);
      }
    });

    if (hasErrors) {
      if (firstErrorField) firstErrorField.focus();
      return;
    }

    // Success
    form.style.display = 'none';
    if (successDiv) successDiv.style.display = 'block';
    showToast('Message sent successfully!', 'success');
  });

  // Send another
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      ['name', 'email', 'message'].forEach(f => clearError(f));
      form.style.display = 'block';
      if (successDiv) successDiv.style.display = 'none';
    });
  }
});

/* ── Validation ─────────────────────────────────── */
function validateField(field, value) {
  const v = value.trim();
  if (field === 'name') {
    if (!v) return 'Name is required.';
    if (v.length < 2) return 'Name must be at least 2 characters.';
    return '';
  }
  if (field === 'email') {
    if (!v) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address.';
    return '';
  }
  if (field === 'message') {
    if (!v) return 'Message is required.';
    if (v.length < 20) return 'Message must be at least 20 characters.';
    return '';
  }
  return '';
}

function getGroupEl(field) {
  const input = document.querySelector(`[name="${field}"]`);
  return input?.closest('.form-group') || null;
}

function showError(field, message) {
  const group  = getGroupEl(field);
  const errEl  = group?.querySelector('.field-error');
  if (group) group.classList.add('has-error');
  if (errEl) errEl.textContent = message;
}

function clearError(field) {
  const group = getGroupEl(field);
  const errEl = group?.querySelector('.field-error');
  if (group) group.classList.remove('has-error');
  if (errEl) errEl.textContent = '';
}
