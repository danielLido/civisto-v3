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
      <div class="container">
        <!-- Enhanced Civic Header -->
        <div class="civic-hero-section">
          <div class="civic-hero-card">
            <!-- Civisto Brand Accents -->
            <div class="civic-accent civic-accent-1"></div>
            <div class="civic-accent civic-accent-2"></div>
            <div class="civic-accent civic-accent-3"></div>
            
            <div class="civic-hero-content">
              <div class="civic-badge">
                <span>Dina Rapporter</span>
              </div>
              
              <p class="civic-description">Transparent uppföljning av dina medborgarrapporter för en bättre kommun</p>
              
              <div class="civic-stats-grid">
                <div class="civic-stat-card">
                  <div class="civic-stat-number">{{ activeReports.length }}</div>
                  <div class="civic-stat-label">Aktiva ärenden</div>
                </div>
                <div class="civic-stat-card">
                  <div class="civic-stat-number">{{ completedReports.length }}</div>
                  <div class="civic-stat-label">Slutförda</div>
                </div>
                <div class="civic-stat-card">
                  <div class="civic-stat-number">{{ allReports.length }}</div>
                  <div class="civic-stat-label">Totalt</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Enhanced Tabs -->
        <ion-segment v-model="activeTab" class="tabs-modern">
          <ion-segment-button value="active">
            <div class="tab-content-modern">
              <span>Aktiva</span>
              <div class="tab-badge-modern">{{ activeReports.length }}</div>
            </div>
          </ion-segment-button>
          <ion-segment-button value="completed">
            <div class="tab-content-modern">
              <span>Slutförda</span>
              <div class="tab-badge-modern">{{ completedReports.length }}</div>
            </div>
          </ion-segment-button>
          <ion-segment-button value="all">
            <div class="tab-content-modern">
              <span>Alla</span>
              <div class="tab-badge-modern">{{ allReports.length }}</div>
            </div>
          </ion-segment-button>
        </ion-segment>
        
        <!-- Active Reports Section -->
        <div v-if="activeTab === 'active'" class="reports-container">
          <div v-if="activeReports.length === 0" class="empty-state-modern">
            <div class="empty-icon-modern">
              <ion-icon :icon="documentOutline"></ion-icon>
            </div>
            <h3>Inga aktiva rapporter</h3>
            <p>Alla dina rapporter har slutförts eller lösts.</p>
            <ion-button class="btn-secondary" @click="$router.push('/report')">
              <ion-icon :icon="addOutline" slot="start"></ion-icon>
              <span>Skapa ny rapport</span>
            </ion-button>
          </div>
          
          <div class="report-card-modern active" v-for="(report, index) in activeReports" :key="index" @click="openReportDetails(report)">
            <div class="report-header-modern">
              <div class="report-icon-modern" :class="report.iconClass">
                <ion-icon :icon="report.icon"></ion-icon>
              </div>
              <div class="report-status-badge" :class="report.statusClass">
                <div class="status-dot-modern"></div>
                <span>{{ report.status }}</span>
              </div>
            </div>
            
            <div class="report-body-modern">
              <h3>{{ report.title }}</h3>
              <div class="report-location-modern">
                <ion-icon :icon="locationOutline"></ion-icon>
                <span>{{ report.location }}</span>
              </div>
              <div class="report-meta-modern">
                <div class="report-time-modern">
                  <ion-icon :icon="timeOutline"></ion-icon>
                  <span>{{ getTimeAgo(report.date) }}</span>
                </div>
                <div class="report-id-modern">#{{ report.id }}</div>
              </div>
            </div>
            
            <div class="report-footer-modern">
              <button class="report-action-modern">
                <span>Visa detaljer</span>
                <ion-icon :icon="arrowForwardOutline"></ion-icon>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Completed Reports Section -->
        <div v-if="activeTab === 'completed'" class="reports-container">
          <div v-if="completedReports.length === 0" class="empty-state-modern">
            <div class="empty-icon-modern completed">
              <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
            </div>
            <h3>Inga slutförda rapporter</h3>
            <p>Dina slutförda rapporter kommer att visas här när ärenden lösts.</p>
          </div>
          
          <div class="report-card-modern completed" v-for="(report, index) in completedReports" :key="index" @click="openReportDetails(report)">
            <div class="report-header-modern">
              <div class="report-icon-modern" :class="report.iconClass">
                <ion-icon :icon="report.icon"></ion-icon>
                <div class="completion-checkmark-modern">
                  <ion-icon :icon="checkmarkOutline"></ion-icon>
                </div>
              </div>
              <div class="report-status-badge completed">
                <div class="status-dot-modern"></div>
                <span>{{ report.status }}</span>
              </div>
            </div>
            
            <div class="report-body-modern">
              <h3>{{ report.title }}</h3>
              <div class="report-location-modern">
                <ion-icon :icon="locationOutline"></ion-icon>
                <span>{{ report.location }}</span>
              </div>
              <div class="completion-info-modern">
                <div class="completion-badge-modern">
                  <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
                  <span>Löst på {{ getCompletionTime(report.date) }} dagar</span>
                </div>
              </div>
            </div>
            
            <div class="report-footer-modern">
              <button class="report-action-modern">
                <span>Visa detaljer</span>
                <ion-icon :icon="arrowForwardOutline"></ion-icon>
              </button>
            </div>
          </div>
        </div>
        
        <!-- All Reports Section -->
        <div v-if="activeTab === 'all'" class="reports-container">
          <div class="report-card-modern" :class="{ completed: report.isCompleted }" v-for="(report, index) in allReports" :key="index" @click="openReportDetails(report)">
            <div class="report-header-modern">
              <div class="report-icon-modern" :class="report.iconClass">
                <ion-icon :icon="report.icon"></ion-icon>
                <div v-if="report.isCompleted" class="completion-checkmark-modern">
                  <ion-icon :icon="checkmarkOutline"></ion-icon>
                </div>
              </div>
              <div class="report-status-badge" :class="report.isCompleted ? 'completed' : report.statusClass">
                <div class="status-dot-modern"></div>
                <span>{{ report.status }}</span>
              </div>
            </div>
            
            <div class="report-body-modern">
              <h3>{{ report.title }}</h3>
              <div class="report-location-modern">
                <ion-icon :icon="locationOutline"></ion-icon>
                <span>{{ report.location }}</span>
              </div>
              <div class="report-meta-modern">
                <div class="report-time-modern">
                  <ion-icon :icon="timeOutline"></ion-icon>
                  <span>{{ getTimeAgo(report.date) }}</span>
                </div>
                <div class="report-id-modern">#{{ report.id }}</div>
              </div>
            </div>
            
            <div class="report-footer-modern">
              <button class="report-action-modern">
                <span>Visa detaljer</span>
                <ion-icon :icon="arrowForwardOutline"></ion-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import useReportsPage from './ReportsPage.js';
useReportsPage();
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Inter:wght@400;500;600;700;800;900&display=swap');

:root {
  --ion-color-primary: #00A651;
  --ion-color-primary-rgb: 0, 166, 81;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-shade: #00894A;
  --ion-color-primary-tint: #1ab565;
  
  --civisto-green: #00A651;
  --civisto-green-dark: #00894A;
  --civisto-green-light: #E8F7EF;
  --civisto-gray: #333333;
  --civisto-light-gray: #F2F2F2;
  
  --civic-blue: #3b82f6;
  --civic-green: #22c55e;
  --civic-yellow: #d97706;
  --civic-red: #dc2626;
  --civic-purple: #7c3aed;
  
  --surface: #FFFFFF;
  --surface-elevated: #F5F5F5;
  --surface-variant: var(--civisto-light-gray);
  --on-surface: #0A0A0A;
  --on-surface-variant: var(--civisto-gray);
  --outline: #E5E5E5;
  --outline-variant: #F0F0F0;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  
  --gradient-civisto: linear-gradient(135deg, var(--civisto-green) 0%, var(--civisto-green-dark) 100%);
  --gradient-primary: linear-gradient(135deg, var(--civisto-green), var(--civisto-green-dark));
  --gradient-accent: linear-gradient(135deg, var(--civisto-green-light), #ffffff);
}

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

.logo {
  font-family: 'Bagel Fat One', cursive;
  font-weight: 400;
  font-size: 28px;
  color: var(--civic-green);
  letter-spacing: -0.02em;
  margin-left: 16px;
}

.header-icons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 40px;
  height: 40px;
  border: 2px solid var(--outline-variant);
}

.container {
  position: relative;
  z-index: 10;
  padding: 0 24px 100px;
  max-width: 800px;
  margin: 0 auto;
}

.civic-hero-section {
  position: relative;
  overflow: hidden;
  margin-bottom: 48px;
  margin-top: -20px;
  margin-left: -24px;
  margin-right: -24px;
}

.civic-hero-card {
  background: var(--gradient-primary);
  border-radius: 0 0 24px 24px;
  box-shadow: 
    0 20px 40px rgba(34, 197, 94, 0.15),
    0 8px 16px rgba(34, 197, 94, 0.1);
  padding: 60px 32px 32px;
  position: relative;
  overflow: hidden;
  min-height: 220px;
  display: flex;
  align-items: center;
}

.civic-accent {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

.civic-accent-1 {
  width: 200px;
  height: 200px;
  top: -60px;
  right: -60px;
  background: rgba(255, 255, 255, 0.1);
}

.civic-accent-2 {
  width: 120px;
  height: 120px;
  bottom: -40px;
  right: 80px;
  background: rgba(255, 255, 255, 0.2);
}

.civic-accent-3 {
  width: 80px;
  height: 80px;
  top: 80px;
  left: -20px;
  background: rgba(255, 255, 255, 0.1);
}

.civic-hero-content {
  position: relative;
  z-index: 10;
  width: 100%;
  text-align: center;
}

.civic-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50px;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--civisto-green);
  margin-bottom: 24px;
  letter-spacing: 0.05em;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.civic-badge ion-icon {
  font-size: 16px;
}

.civic-hero-card h1 {
  font-size: 42px;
  font-weight: 900;
  color: white;
  margin-bottom: 16px;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.civic-highlight {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
  position: relative;
}

.civic-hero-card p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 32px;
  font-weight: 500;
  line-height: 1.5;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.civic-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.civic-stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
  transition: all 0.3s ease;
}

.civic-stat-card:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.civic-stat-number {
  font-size: 28px;
  font-weight: 900;
  color: white;
  margin-bottom: 4px;
  line-height: 1;
}

.civic-stat-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tabs-modern {
  margin-bottom: 48px;
  border-radius: 20px;
  background: white;
  box-shadow: 
    0 8px 32px rgba(34, 197, 94, 0.08),
    0 4px 16px rgba(34, 197, 94, 0.04);
  border: 1px solid rgba(34, 197, 94, 0.1);
  padding: 8px;
}

ion-segment-button {
  --color: var(--civisto-gray);
  --color-checked: var(--civic-green);
  --background-checked: rgba(34, 197, 94, 0.08);
  --border-color: transparent;
  --indicator-color: transparent;
  min-height: 48px;
  font-weight: 600;
  border-radius: 14px;
  margin: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

ion-segment-button::part(indicator) {
  display: none;
}

ion-segment-button[checked] {
  background: rgba(34, 197, 94, 0.08);
  color: var(--civic-green);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.15);
}

.tab-content-modern {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-badge-modern {
  background: var(--civic-green);
  color: white;
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  min-width: 22px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);
}

ion-segment-button:not([checked]) .tab-badge-modern {
  background: var(--outline);
  color: var(--civisto-gray);
  box-shadow: none;
}

.reports-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.report-card-modern {
  background: white;
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(0, 166, 81, 0.08),
    0 4px 16px rgba(0, 166, 81, 0.04);
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 166, 81, 0.1);
  position: relative;
  overflow: hidden;
}

.report-card-modern:hover {
  transform: translateY(-6px);
  box-shadow: 
    0 16px 48px rgba(0, 166, 81, 0.12),
    0 8px 24px rgba(0, 166, 81, 0.08);
}

.report-status-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 20px 20px 0 0;
}

.report-status-indicator.new {
  background: linear-gradient(90deg, #0369a1, #0284c7);
}

.report-status-indicator.in-progress {
  background: linear-gradient(90deg, #d97706, #f59e0b);
}

.report-status-indicator.resolved,
.report-status-indicator.completed {
  background: linear-gradient(90deg, #16a34a, #22c55e);
}

.report-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.report-icon-modern {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 26px;
  position: relative;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.report-icon-modern.electricity { 
  background: linear-gradient(135deg, #f59e0b, #eab308);
}

.report-icon-modern.retail { 
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.report-icon-modern.maintenance { 
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.completion-checkmark-modern {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 22px;
  height: 22px;
  background: var(--civisto-green);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.report-status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-dot-modern {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.report-status-badge.new {
  background: #e0f2fe;
  color: #0369a1;
}

.report-status-badge.new .status-dot-modern {
  background: #0369a1;
}

.report-status-badge.in-progress {
  background: #fef3c7;
  color: #d97706;
}

.report-status-badge.in-progress .status-dot-modern {
  background: #d97706;
}

.report-status-badge.resolved,
.report-status-badge.completed {
  background: #dcfce7;
  color: #16a34a;
}

.report-status-badge.resolved .status-dot-modern,
.report-status-badge.completed .status-dot-modern {
  background: #16a34a;
}

.report-body-modern {
  margin-bottom: 20px;
}

.report-body-modern h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--on-surface);
  margin: 0 0 12px 0;
}

.report-location-modern {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--on-surface-variant);
  font-size: 14px;
  margin-bottom: 8px;
}

.report-location-modern ion-icon {
  font-size: 16px;
}

.report-meta-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--on-surface-variant);
}

.report-time-modern {
  display: flex;
  align-items: center;
  gap: 4px;
}

.report-time-modern ion-icon {
  font-size: 14px;
}

.report-id-modern {
  font-weight: 600;
  color: var(--civisto-green);
}

.report-footer-modern {
  border-top: 1px solid var(--outline-variant);
  padding-top: 16px;
}

.report-action-modern {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
  color: var(--civisto-green);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.report-action-modern:hover {
  color: var(--civisto-green-dark);
}

.report-action-modern ion-icon {
  font-size: 16px;
  transition: transform 0.3s ease;
}

.report-action-modern:hover ion-icon {
  transform: translateX(4px);
}

.completion-info-modern {
  margin-top: 8px;
}

.completion-badge-modern {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--civisto-green-light);
  color: var(--civisto-green-dark);
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  border: 1px solid rgba(0, 166, 81, 0.2);
  box-shadow: 0 2px 4px rgba(0, 166, 81, 0.1);
}

.completion-badge-modern ion-icon {
  font-size: 14px;
}

.empty-state-modern {
  grid-column: 1 / -1;
  text-align: center;
  padding: 64px 32px;
  background: white;
  border-radius: 24px;
  box-shadow: 
    0 8px 32px rgba(0, 166, 81, 0.08),
    0 4px 16px rgba(0, 166, 81, 0.04);
  border: 1px solid rgba(0, 166, 81, 0.1);
  position: relative;
  overflow: hidden;
}

.empty-state-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
  border-radius: 24px 24px 0 0;
}

.empty-icon-modern {
  width: 96px;
  height: 96px;
  margin: 0 auto 32px;
  background: var(--civisto-green-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--civisto-green);
  font-size: 48px;
  box-shadow: 0 8px 24px rgba(0, 166, 81, 0.15);
  position: relative;
}

.empty-icon-modern::after {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
  z-index: -1;
}

.empty-icon-modern.completed {
  background: linear-gradient(135deg, var(--civisto-green), var(--civisto-green-dark));
  color: white;
  box-shadow: 0 8px 24px rgba(0, 166, 81, 0.25);
}

.empty-state-modern h3 {
  font-size: 24px;
  font-weight: 800;
  color: var(--on-surface);
  margin: 0 0 12px 0;
  letter-spacing: -0.01em;
}

.empty-state-modern p {
  font-size: 16px;
  color: var(--on-surface-variant);
  margin: 0 0 32px 0;
  line-height: 1.6;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.btn-secondary {
  --background: var(--civisto-green);
  --color: white;
  --border-radius: 16px;
  --padding-start: 32px;
  --padding-end: 32px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  font-weight: 700;
  font-size: 15px;
  box-shadow: 
    0 8px 24px rgba(0, 166, 81, 0.25),
    0 4px 12px rgba(0, 166, 81, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-secondary:hover {
  --background: var(--civisto-green-dark);
  transform: translateY(-2px);
  box-shadow: 
    0 12px 32px rgba(0, 166, 81, 0.3),
    0 6px 16px rgba(0, 166, 81, 0.2);
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg) scale(1); 
  }
  33% { 
    transform: translateY(-15px) rotate(2deg) scale(1.02); 
  }
  66% { 
    transform: translateY(-8px) rotate(-1deg) scale(0.98); 
  }
}

@keyframes pulse {
  0%, 100% { 
    opacity: 0.1; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.3; 
    transform: scale(1.05); 
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(32px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.report-card-modern {
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.report-card-modern:nth-child(1) { animation-delay: 0ms; }
.report-card-modern:nth-child(2) { animation-delay: 150ms; }
.report-card-modern:nth-child(3) { animation-delay: 300ms; }
.report-card-modern:nth-child(4) { animation-delay: 450ms; }
.report-card-modern:nth-child(5) { animation-delay: 600ms; }

@keyframes civicHeroSlide {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.civic-hero-content {
  animation: civicHeroSlide 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.civic-stats-grid {
  animation: civicHeroSlide 1s cubic-bezier(0.4, 0, 0.2, 1);
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

@media (max-width: 768px) {  
  .container {
    padding: 0px 20px 100px;
  }
  
  .civic-hero-section {
    margin-top: -20px;
    margin-left: -20px;
    margin-right: -20px;
  }
  
  .civic-hero-card {
    padding: 52px 24px 24px;
    min-height: 180px;
    border-radius: 0 0 20px 20px;
  }
  
  .civic-hero-card h1 {
    font-size: 28px;
  }
  
  .civic-hero-card p {
    font-size: 14px;
    margin-bottom: 20px;
  }
  
  .civic-stats-grid {
    gap: 12px;
    max-width: 100%;
  }
  
  .civic-stat-card {
    padding: 12px 8px;
  }
  
  .civic-stat-number {
    font-size: 20px;
  }
  
  .civic-stat-label {
    font-size: 10px;
  }
  
  .reports-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .report-card-modern {
    padding: 20px;
  }
  
  .logo {
    margin-left: 8px;
    font-size: 24px;
  }
  
  .empty-state-modern {
    padding: 48px 24px;
  }
  
  .empty-icon-modern {
    width: 80px;
    height: 80px;
    font-size: 40px;
    margin-bottom: 24px;
  }
}

@media (hover: none) {
  .report-card-modern:hover {
    transform: none;
    box-shadow: 
      0 8px 32px rgba(0, 166, 81, 0.08),
      0 4px 16px rgba(0, 166, 81, 0.04);
  }
  
  .report-card-modern:active {
    transform: scale(0.98);
  }
  
  .civic-stat-card:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: none;
  }
  
  .civic-stat-card:active {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(0.96);
  }
}

.report-card-modern:focus-visible {
  outline: 3px solid var(--civisto-green);
  outline-offset: 2px;
}

.report-action-modern:focus-visible {
  outline: 2px solid var(--civisto-green);
  outline-offset: 2px;
  border-radius: 4px;
}

ion-segment-button:focus-visible {
  outline: 3px solid var(--civisto-green);
  outline-offset: 2px;
  border-radius: 14px;
}

.civic-stat-card:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 2px;
}

@media (prefers-contrast: high) {
  .report-card-modern {
    border: 2px solid var(--civisto-green);
  }
  
  .civic-badge {
    border: 2px solid rgba(255, 255, 255, 0.8);
  }
  
  .civic-stat-card {
    border: 1px solid rgba(255, 255, 255, 0.6);
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .status-dot-modern,
  .civic-accent-1,
  .civic-accent-2,
  .civic-accent-3 {
    animation: none !important;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    padding: 0 60px 120px;
  }
  
  .civic-hero-section {
    margin-bottom: 64px;
    margin-top: -20px;
    margin-left: -60px;
    margin-right: -60px;
  }
  
  .civic-hero-card {
    padding: 68px 60px 36px;
    min-height: 260px;
    border-radius: 0 0 28px 28px;
  }
  
  .civic-description {
    font-size: 18px;
    margin-bottom: 32px;
  }
  
  .civic-stats-grid {
    gap: 24px;
    max-width: 600px;
  }
  
  .civic-stat-card {
    padding: 20px 16px;
  }
  
  .civic-stat-number {
    font-size: 28px;
  }
  
  .civic-stat-label {
    font-size: 12px;
  }
  
  .reports-container {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 32px;
  }
  
  .tabs-modern {
    margin-bottom: 64px;
  }
  
  .report-card-modern {
    padding: 32px;
  }
  
  .report-icon-modern {
    width: 56px;
    height: 56px;
    font-size: 28px;
  }
  
  .report-body-modern h3 {
    font-size: 20px;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --surface: #1e293b;
    --surface-elevated: #0f172a;
    --surface-variant: #334155;
    --on-surface: #f8fafc;
    --on-surface-variant: #cbd5e1;
    --outline: #475569;
    --outline-variant: #334155;
  }
  
  .background-pattern {
    background: 
      radial-gradient(circle at 15% 40%, rgba(0, 166, 81, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 85% 20%, rgba(232, 247, 239, 0.02) 0%, transparent 50%),
      radial-gradient(circle at 50% 80%, rgba(0, 166, 81, 0.02) 0%, transparent 50%),
      linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 70%, #1e293b 100%);
  }
  
  .report-card-modern,
  .tabs-modern,
  .empty-state-modern {
    background: var(--surface);
    border-color: var(--outline);
  }
  
  .empty-icon-modern {
    background: var(--surface-variant);
    color: var(--on-surface-variant);
  }
}
</style>


