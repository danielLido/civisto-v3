<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="logo" slot="start">Civisto</div>
      </ion-toolbar>
    </ion-header>

    <!-- Dynamic Background -->
    <div class="background-pattern"></div>

    <ion-content>
      <div class="main-content">
        <!-- Bold Hero Section -->
        <div class="hero-section">
          <div class="hero-card">
            <!-- Geometric Background Elements -->
            <div class="geo-shape shape-1"></div>
            <div class="geo-shape shape-2"></div>
            <div class="geo-shape shape-3"></div>
            
            <div class="hero-content">
              <div class="hero-badge">🇸🇪 Rapportera i din kommun</div>
              <h1>Rapportera.<br>Påverka.<br><span class="highlight">Förbättra.</span></h1>
              <p>En digital plattform som förenar medborgare och kommuner för en bättre framtid</p>
              
              <!-- Action Buttons -->
              <div class="action-buttons">
                <ion-button class="btn-primary" expand="block" @click="reportIssue">
                  <ion-icon :icon="addOutline" slot="start"></ion-icon>
                  <span>Skapa rapport</span>
                </ion-button>
              </div>
            </div>
          </div>
        </div>

        <!-- How It Works Slider -->
        <div class="how-it-works-section">
          <div class="section-header-modern">
            <div class="section-badge">Hur det fungerar</div>
            <h2>Tre enkla steg</h2>
            <p>Från problem till lösning på några minuter</p>
          </div>
          
          <div class="steps-slider-container">
            <div class="steps-slider" :style="{ transform: `translateX(${-currentStep * 100}%)` }">
              <div class="step-slide" v-for="(step, index) in steps" :key="index">
                <div class="step-illustration">
                  <div class="step-icon-large" :class="step.iconClass">
                    <ion-icon :icon="step.icon"></ion-icon>
                  </div>
                </div>
                
                <div class="step-content-modern">
                  <div class="step-number-badge">{{ index + 1 }}</div>
                  <h3>{{ step.title }}</h3>
                  <p>{{ step.description }}</p>
                  <div class="step-features">
                    <div class="feature-item" v-for="feature in step.features" :key="feature">
                      <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
                      <span>{{ feature }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Slider Controls -->
            <div class="slider-controls">
              <button class="slider-arrow prev" @click="prevStep" :disabled="currentStep === 0">
                <ion-icon :icon="chevronBackOutline"></ion-icon>
              </button>
              <div class="slider-dots">
                <div 
                  v-for="(step, index) in steps" 
                  :key="index"
                  class="slider-dot"
                  :class="{ active: index === currentStep }"
                  @click="currentStep = index"
                ></div>
              </div>
              <button class="slider-arrow next" @click="nextStep" :disabled="currentStep === steps.length - 1">
                <ion-icon :icon="chevronForwardOutline"></ion-icon>
              </button>
            </div>
          </div>
        </div>

        <!-- Your Reports Section -->
        <div class="reports-section">
          <div class="section-header-modern">
            <div class="section-badge">Dina rapporter</div>
            <h2>Senaste aktiviteter</h2>
            <ion-button fill="clear" class="view-all-modern" @click="viewAllReports">
              <span>Visa alla</span>
              <ion-icon :icon="chevronForwardOutline" slot="end"></ion-icon>
            </ion-button>
          </div>
          
          <div class="reports-grid">
            <div class="report-card" v-for="(report, index) in recentReports" :key="index" @click="openReport(report)">
              <div class="report-header">
                <div class="report-icon" :class="report.iconClass">
                  <ion-icon :icon="report.icon"></ion-icon>
                </div>
                <div class="report-status" :class="report.statusClass">
                  <div class="status-dot"></div>
                  <span>{{ report.status }}</span>
                </div>
              </div>
              
              <div class="report-body">
                <h3>{{ report.title }}</h3>
                <div class="report-location">
                  <ion-icon :icon="locationOutline"></ion-icon>
                  <span>{{ report.location }}</span>
                </div>
                <div class="report-meta">
                  <div class="report-time">
                    <ion-icon :icon="timeOutline"></ion-icon>
                    <span>{{ report.time }}</span>
                  </div>
                  <div class="report-id">#{{ report.id }}</div>
                </div>
              </div>
              
              <div class="report-footer">
                <button class="report-action">
                  <span>Visa detaljer</span>
                  <ion-icon :icon="arrowForwardOutline"></ion-icon>
                </button>
              </div>
            </div>
            
            <!-- Empty State -->
            <div class="empty-state" v-if="recentReports.length === 0">
              <div class="empty-icon">
                <ion-icon :icon="documentTextOutline"></ion-icon>
              </div>
              <h3>Inga rapporter ännu</h3>
              <p>Skapa din första rapport för att göra skillnad i din kommun</p>
              <ion-button class="btn-secondary" @click="reportIssue">
                <ion-icon :icon="addOutline" slot="start"></ion-icon>
                <span>Skapa rapport</span>
              </ion-button>
            </div>
          </div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Inter:wght@400;500;600;700;800;900&display=swap');

/* Enhanced Variables */
:root {
  --ion-color-primary: #22c55e;
  --ion-color-primary-rgb: 34, 197, 94;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-shade: #16a34a;
  --ion-color-primary-tint: #10b981;
  
  --civic-blue: #3b82f6;
  --civic-green: #22c55e;
  --civic-yellow: #d97706;
  --civic-red: #dc2626;
  --civic-purple: #7c3aed;
  
  --surface: #ffffff;
  --surface-elevated: #f8fafc;
  --surface-variant: #f1f5f9;
  --on-surface: #0f172a;
  --on-surface-variant: #475569;
  --outline: #cbd5e1;
  --outline-variant: #e2e8f0;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  
  --gradient-primary: linear-gradient(135deg, var(--civic-green), var(--ion-color-primary-shade));
  --gradient-success: linear-gradient(135deg, var(--civic-green), #10b981);
  --gradient-warning: linear-gradient(135deg, var(--civic-yellow), #f59e0b);
}

/* Global Overrides */
ion-content {
  --background: var(--surface-elevated);
}

ion-toolbar {
  --background: var(--surface);
  --border-color: var(--outline-variant);
  --padding-top: 20px;
  --padding-bottom: 20px;
  --padding-start: 24px;
  --padding-end: 24px;
  box-shadow: var(--shadow-sm);
}

/* Dynamic Background */
.background-pattern {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: 
    radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(34, 197, 94, 0.04) 0%, transparent 50%),
    linear-gradient(135deg, #f8fffe 0%, #f0fdf4 30%, #ecfdf5 70%, #fafafa 100%);
}

/* Header */
.logo {
  font-family: 'Bagel Fat One', cursive;
  font-weight: 400;
  font-size: 28px;
  color: var(--civic-green);
  letter-spacing: -0.02em;
  margin-left: 16px;
}

/* Main Content */
.main-content {
  position: relative;
  z-index: 10;
  padding: 0 24px 100px;
}

/* Bold Hero Section - Edge to Edge */
.hero-section {
  position: relative;
  overflow: hidden;
  margin-bottom: 48px;
  margin-top: -20px;
  margin-left: -24px;
  margin-right: -24px;
}

.hero-card {
  background: var(--gradient-primary);
  border-radius: 0 0 24px 24px;
  box-shadow: var(--shadow-xl);
  padding: 68px 32px 48px;
  position: relative;
  overflow: hidden;
  min-height: 420px;
  display: flex;
  align-items: center;
}

/* Geometric Shapes */
.geo-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  right: -50px;
  animation: float 8s ease-in-out infinite;
}

.shape-2 {
  width: 120px;
  height: 120px;
  bottom: -30px;
  right: 100px;
  animation: float 12s ease-in-out infinite reverse;
}

.shape-3 {
  width: 80px;
  height: 80px;
  top: 100px;
  left: -20px;
  animation: pulse 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.2; transform: scale(1.1); }
}

.hero-content {
  position: relative;
  z-index: 10;
  width: 100%;
  text-align: center;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50px;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--civic-green);
  margin-bottom: 24px;
  letter-spacing: 0.05em;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.hero-card h1 {
  font-size: 40px;
  font-weight: 900;
  color: white;
  margin-bottom: 20px;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.highlight {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
}

.hero-card p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 32px;
  font-weight: 500;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 0;
}

/* Enhanced Buttons */
.btn-primary {
  --background: rgba(255, 255, 255, 0.95);
  --color: var(--civic-green);
  --border-radius: 16px;
  --box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  --padding-start: 40px;
  --padding-end: 40px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  font-weight: 700;
  font-size: 16px;
  margin: 0;
  min-width: 200px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.btn-secondary {
  --background: var(--civic-green);
  --color: white;
  --border-radius: 12px;
  --padding-start: 24px;
  --padding-end: 24px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  font-weight: 600;
  font-size: 15px;
}

/* Modern Section Headers */
.section-header-modern {
  text-align: center;
  margin-bottom: 48px;
  position: relative;
}

.section-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--civic-green), #10b981);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.section-header-modern h2 {
  font-size: 32px;
  font-weight: 900;
  color: var(--on-surface);
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.section-header-modern p {
  font-size: 16px;
  color: var(--on-surface-variant);
  margin: 0;
  font-weight: 500;
}

.view-all-modern {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  --color: var(--civic-green);
  font-weight: 600;
  font-size: 15px;
}

/* How It Works - Modern Slider Design */
.how-it-works-section {
  padding: 64px 24px;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
}

.steps-slider-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 24px;
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.steps-slider {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-slide {
  flex: 0 0 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 32px;
  text-align: center;
  position: relative;
}

.step-illustration {
  margin-bottom: 32px;
  position: relative;
}

.step-icon-large {
  width: 120px;
  height: 120px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  margin: 0 auto;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.step-icon-large::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 30px;
  background: inherit;
  opacity: 0.1;
  transform: scale(1.5);
  transition: transform 0.3s ease;
}

.step-icon-large:hover::before {
  transform: scale(1.2);
}

.step-icon-large:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.step-icon-large.blue {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.step-icon-large.orange {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.step-icon-large.green {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.step-content-modern {
  max-width: 500px;
  position: relative;
}

.step-number-badge {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 900;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
  z-index: 10;
}

.step-content-modern h3 {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 16px 0;
  letter-spacing: -0.01em;
}

.step-content-modern p {
  font-size: 18px;
  color: #64748b;
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.step-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: #475569;
  background: rgba(34, 197, 94, 0.05);
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(34, 197, 94, 0.1);
}

.feature-item ion-icon {
  color: #22c55e;
  font-size: 18px;
}

/* Slider Controls */
.slider-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 24px 32px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.slider-arrow {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #22c55e;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.slider-arrow:hover:not(:disabled) {
  background: #22c55e;
  color: white;
  border-color: #22c55e;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.2);
  transform: translateY(-2px);
}

.slider-arrow:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.slider-dots {
  display: flex;
  gap: 12px;
}

.slider-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #cbd5e1;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider-dot.active {
  width: 32px;
  border-radius: 6px;
  background: #22c55e;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

/* Reports Section */
.reports-section {
  padding: 48px 24px;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.report-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--outline-variant);
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
}

.report-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.report-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.report-icon.electricity { 
  background: linear-gradient(135deg, var(--civic-yellow), #f59e0b);
}
.report-icon.retail { 
  background: linear-gradient(135deg, var(--civic-green), #10b981);
}
.report-icon.maintenance { 
  background: linear-gradient(135deg, var(--civic-blue), #2563eb);
}

.report-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: pulseAnimation 2s ease-in-out infinite;
}

.report-status.new {
  background: rgba(59, 130, 246, 0.1);
  color: var(--civic-blue);
}

.report-status.new .status-dot {
  background: var(--civic-blue);
}

.report-status.in-progress {
  background: rgba(217, 119, 6, 0.1);
  color: var(--civic-yellow);
}

.report-status.in-progress .status-dot {
  background: var(--civic-yellow);
}

.report-status.resolved {
  background: rgba(34, 197, 94, 0.1);
  color: var(--civic-green);
}

.report-status.resolved .status-dot {
  background: var(--civic-green);
}

.report-body {
  margin-bottom: 20px;
}

.report-body h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--on-surface);
  margin: 0 0 12px 0;
}

.report-location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--on-surface-variant);
  font-size: 14px;
  margin-bottom: 8px;
}

.report-location ion-icon {
  font-size: 16px;
}

.report-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--on-surface-variant);
}

.report-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.report-time ion-icon {
  font-size: 14px;
}

.report-id {
  font-weight: 600;
  color: var(--civic-green);
}

.report-footer {
  border-top: 1px solid var(--outline-variant);
  padding-top: 16px;
}

.report-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
  color: var(--civic-green);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.report-action:hover {
  color: var(--ion-color-primary-shade);
}

.report-action ion-icon {
  font-size: 16px;
  transition: transform 0.3s ease;
}

.report-action:hover ion-icon {
  transform: translateX(4px);
}

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 48px 24px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--outline-variant);
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, var(--surface-variant), var(--outline-variant));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--on-surface-variant);
  font-size: 40px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--on-surface);
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 16px;
  color: var(--on-surface-variant);
  margin: 0 0 24px 0;
  line-height: 1.5;
}

/* Mobile Responsiveness for Slider */
@media (max-width: 768px) {
  .main-content {
    padding: 0 20px 100px;
  }
  
  .hero-section {
    margin-left: -20px;
    margin-right: -20px;
  }
  
  .hero-card {
    padding: 52px 24px 32px;
    min-height: 360px;
    border-radius: 0 0 20px 20px;
  }
  
  .hero-card h1 {
    font-size: 32px;
  }
  
  .hero-card p {
    font-size: 16px;
  }
  
  .section-header-modern h2 {
    font-size: 28px;
  }
  
  .how-it-works-section {
    padding: 48px 20px;
  }
  
  .step-slide {
    padding: 32px 20px;
  }
  
  .step-icon-large {
    width: 100px;
    height: 100px;
    font-size: 40px;
    border-radius: 25px;
  }
  
  .step-icon-large::before {
    border-radius: 25px;
  }
  
  .step-content-modern h3 {
    font-size: 24px;
  }
  
  .step-content-modern p {
    font-size: 16px;
  }
  
  .slider-controls {
    padding: 20px 24px;
    gap: 16px;
  }
  
  .slider-arrow {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }
  
  .reports-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .report-card {
    max-width: 100%;
  }
  
  .view-all-modern {
    position: static;
    transform: none;
    margin-top: 16px;
  }
  
  .section-header-modern {
    margin-bottom: 32px;
  }
  
  .logo {
    margin-left: 8px;
    font-size: 24px;
  }
}

/* Desktop Layout */
@media (min-width: 769px) {
  .steps-slider-container {
    max-width: 900px;
  }
  
  .step-slide {
    padding: 56px 48px;
  }
  
  .step-icon-large {
    width: 140px;
    height: 140px;
    font-size: 56px;
    border-radius: 35px;
  }
  
  .step-icon-large::before {
    border-radius: 35px;
  }
}

/* Touch Interactions */
@media (hover: none) {
  .report-card:hover {
    transform: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  
  .report-card:active {
    transform: scale(0.98);
  }
  
  .slider-arrow:hover:not(:disabled) {
    background: white;
    color: #22c55e;
    border-color: #e2e8f0;
    transform: none;
  }
  
  .slider-arrow:active:not(:disabled) {
    background: #22c55e;
    color: white;
    border-color: #22c55e;
    transform: scale(0.95);
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .steps-slider {
    transition: none;
  }
  
  .geo-shape {
    animation: none;
  }
  
  .status-dot {
    animation: none;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .hero-card {
    border: 2px solid var(--on-surface);
  }
  
  .report-card {
    border: 2px solid var(--outline);
  }
  
  .section-badge {
    border: 1px solid var(--on-surface);
  }
}

/* Large Screen Optimization */
@media (min-width: 1024px) {
  .main-content {
    padding: 0 60px 120px;
  }
  
  .hero-section {
    margin-left: -60px;
    margin-right: -60px;
    margin-bottom: 64px;
  }
  
  .hero-card {
    padding: 80px 60px 56px;
    min-height: 480px;
    border-radius: 0 0 28px 28px;
  }
  
  .hero-card h1 {
    font-size: 48px;
  }
  
  .hero-card p {
    font-size: 20px;
  }
  
  .reports-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 32px;
  }
  
  .how-it-works-section {
    padding: 80px 60px;
  }
  
  .reports-section {
    padding: 64px 60px;
  }
}

@keyframes pulseAnimation {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
