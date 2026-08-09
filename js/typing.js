/* ============================================================
   TYPING.JS — Typewriter Animation for Hero Section
   ============================================================ */

class TypeWriter {
  constructor(elementId, roles, options = {}) {
    this.el      = document.getElementById(elementId);
    this.roles   = roles;
    this.speed   = options.speed   || 90;
    this.pause   = options.pause   || 2000;
    this.erase   = options.erase   || 50;
    this.current = 0;
    this.index   = 0;
    this.deleting = false;
    this.timer    = null;
    if (this.el) this.run();
  }

  run() {
    const role = this.roles[this.current];

    if (!this.deleting) {
      // Typing
      this.el.textContent = role.substring(0, this.index + 1);
      this.index++;
      if (this.index === role.length) {
        // Pause then erase
        this.timer = setTimeout(() => {
          this.deleting = true;
          this.run();
        }, this.pause);
        return;
      }
    } else {
      // Erasing
      this.el.textContent = role.substring(0, this.index - 1);
      this.index--;
      if (this.index === 0) {
        this.deleting = false;
        this.current  = (this.current + 1) % this.roles.length;
      }
    }
    const delay = this.deleting ? this.erase : this.speed;
    this.timer  = setTimeout(() => this.run(), delay);
  }

  destroy() {
    clearTimeout(this.timer);
  }
}

// Export for main.js
window.TypeWriter = TypeWriter;
