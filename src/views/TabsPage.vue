<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" class="main-tab-bar">
        <ion-tab-button tab="home" href="/tabs/home" class="tab-button">
          <div class="icon-container">
            <ion-icon :icon="homeOutline" class="tab-icon"></ion-icon>
          </div>
          <ion-label class="tab-label">Hem</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="reports" href="/tabs/reports" class="tab-button">
          <div class="icon-container">
            <ion-icon :icon="documentTextOutline" class="tab-icon"></ion-icon>
          </div>
          <ion-label class="tab-label">Rapporter</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="chat-report" href="/tabs/chat-report" class="tab-button report-tab">
          <div class="report-button">
            <ion-icon :icon="add" class="report-icon"></ion-icon>
          </div>
          <ion-label class="tab-label report-label">Rapportera</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="achievements" href="/tabs/achievements" class="tab-button">
          <div class="icon-container">
            <ion-icon :icon="ribbonOutline" class="tab-icon"></ion-icon>
          </div>
          <ion-label class="tab-label">Impact</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="profile" href="/tabs/profile" class="tab-button">
          <div class="icon-container">
            <ion-icon :icon="personOutline" class="tab-icon"></ion-icon>
          </div>
          <ion-label class="tab-label">Profil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonTabs, 
  IonTabBar, 
  IonTabButton, 
  IonIcon, 
  IonLabel, 
  IonRouterOutlet,
  IonPage
} from '@ionic/vue';
import { 
  homeOutline, 
  personOutline,
  ribbonOutline,
  documentTextOutline,
  add
} from 'ionicons/icons';
</script>

<style scoped>
/* Main tab bar - fixed height and positioning */
.main-tab-bar {
  --background: #ffffff;
  --border: 1px solid #e5e7eb;
  height: 80px; /* Fixed height instead of auto */
  padding: 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
}

/* Individual tab button styling */
.tab-button {
  --color: #6b7280;
  --color-selected: #22c55e;
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0;
  --padding-end: 0;
  --ripple-color: rgba(34, 197, 94, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex: 1;
  position: relative;
  transition: all 0.2s ease;
  overflow: visible; /* Ensure content isn't clipped */
}

/* Icon container for regular tabs */
.icon-container {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  margin-bottom: 4px;
  transition: all 0.3s ease;
  flex-shrink: 0; /* Prevent icon from shrinking */
}

.tab-icon {
  font-size: 20px;
  transition: all 0.2s ease;
  color: #6b7280;
}

.tab-label {
  font-size: 11px;
  margin: 0;
  font-weight: 500;
  transition: all 0.2s ease;
  color: #6b7280;
  text-align: center;
  line-height: 1.2;
  flex-shrink: 0; /* Prevent label from shrinking */
}

/* Report button - special styling for center button */
.report-tab {
  --ripple-color: rgba(34, 197, 94, 0.2);
}

.report-button {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
  transition: all 0.2s ease;
  flex-shrink: 0; /* Prevent button from shrinking */
}

.report-icon {
  color: white;
  font-size: 24px;
}

.report-label {
  color: #22c55e;
  font-weight: 600;
}

/* Selected state styling */
.tab-button.tab-selected .icon-container {
  background-color: #22c55e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
}

.tab-button.tab-selected .tab-icon {
  color: white;
  transform: scale(1.1);
}

.tab-button.tab-selected .tab-label {
  color: #22c55e;
  font-weight: 600;
}

.tab-button.tab-selected.report-tab .report-button {
  background: linear-gradient(135deg, #16a34a, #15803d);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

/* Active/pressed state */
.tab-button:active .icon-container {
  transform: scale(0.95);
}

.tab-button.report-tab:active .report-button {
  transform: scale(0.95);
}

/* Hover effects for desktop */
@media (hover: hover) {
  .tab-button:hover .icon-container {
    background-color: #e5e7eb;
    transform: translateY(-1px);
  }
  
  .tab-button:hover .tab-icon {
    color: #374151;
  }
  
  .tab-button.report-tab:hover .report-button {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
  }
  
  .tab-button.tab-selected:hover .icon-container {
    background-color: #16a34a;
  }
}

/* Responsive design for different screen sizes */

/* Small phones (320px - 375px) */
@media (max-width: 375px) {
  .main-tab-bar {
    height: 70px;
  }
  
  .icon-container {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    margin-bottom: 2px;
  }
  
  .tab-icon {
    font-size: 18px;
  }
  
  .tab-label {
    font-size: 10px;
  }
  
  .report-button {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    margin-bottom: 2px;
  }
  
  .report-icon {
    font-size: 22px;
  }
}

/* Large phones (414px+) */
@media (min-width: 415px) and (max-width: 767px) {
  .main-tab-bar {
    height: 85px;
  }
  
  .icon-container {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    margin-bottom: 6px;
  }
  
  .tab-icon {
    font-size: 22px;
  }
  
  .tab-label {
    font-size: 12px;
  }
  
  .report-button {
    width: 52px;
    height: 52px;
    border-radius: 18px;
    margin-bottom: 6px;
  }
  
  .report-icon {
    font-size: 26px;
  }
}

/* Tablets (768px+) */
@media (min-width: 768px) {
  .main-tab-bar {
    height: 90px;
    max-width: 600px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 16px 16px 0 0;
  }
  
  .icon-container {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    margin-bottom: 6px;
  }
  
  .tab-icon {
    font-size: 24px;
  }
  
  .tab-label {
    font-size: 13px;
  }
  
  .report-button {
    width: 56px;
    height: 56px;
    border-radius: 20px;
    margin-bottom: 6px;
  }
  
  .report-icon {
    font-size: 28px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .main-tab-bar {
    max-width: 800px;
    border-radius: 20px 20px 0 0;
  }
}

/* Safe area adjustments for devices with notches */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .main-tab-bar {
    height: calc(80px + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  @media (max-width: 375px) {
    .main-tab-bar {
      height: calc(70px + env(safe-area-inset-bottom));
    }
  }
  
  @media (min-width: 415px) and (max-width: 767px) {
    .main-tab-bar {
      height: calc(85px + env(safe-area-inset-bottom));
    }
  }
  
  @media (min-width: 768px) {
    .main-tab-bar {
      height: calc(90px + env(safe-area-inset-bottom));
    }
  }
}

/* Ensure tab bar container doesn't clip content */
:deep(.ion-page) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(ion-tabs) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(ion-router-outlet) {
  flex: 1;
  overflow: auto;
}

/* Ensure content doesn't get hidden behind tab bar */
:deep(ion-content) {
  --padding-bottom: 80px;
}

@media (max-width: 375px) {
  :deep(ion-content) {
    --padding-bottom: 70px;
  }
}

@media (min-width: 415px) and (max-width: 767px) {
  :deep(ion-content) {
    --padding-bottom: 85px;
  }
}

@media (min-width: 768px) {
  :deep(ion-content) {
    --padding-bottom: 90px;
  }
}

/* Additional safe area padding for content */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  :deep(ion-content) {
    --padding-bottom: calc(80px + env(safe-area-inset-bottom));
  }
  
  @media (max-width: 375px) {
    :deep(ion-content) {
      --padding-bottom: calc(70px + env(safe-area-inset-bottom));
    }
  }
  
  @media (min-width: 415px) and (max-width: 767px) {
    :deep(ion-content) {
      --padding-bottom: calc(85px + env(safe-area-inset-bottom));
    }
  }
  
  @media (min-width: 768px) {
    :deep(ion-content) {
      --padding-bottom: calc(90px + env(safe-area-inset-bottom));
    }
  }
}

/* Debug - remove if everything works */
.main-tab-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: red;
  display: none; /* Enable to see where the tab bar starts */
}
</style>
