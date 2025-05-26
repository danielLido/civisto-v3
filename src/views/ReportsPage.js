import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonAvatar
} from '@ionic/vue';
import {
  chevronBackOutline,
  notificationsOutline,
  documentTextOutline,
  documentOutline,
  checkmarkCircleOutline,
  checkmarkOutline,
  locationOutline,
  timeOutline,
  arrowForwardOutline,
  addOutline,
  refreshCircle,
  timeOutline as timeIcon,
  alertCircleOutline,
  gridOutline
} from 'ionicons/icons';

export default defineComponent({
  name: 'SimplifiedReportsPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonIcon,
    IonAvatar
  },
  setup() {
    const router = useRouter();
    const activeTab = ref('active');
    
    // Define the report data with matching icon classes from home page
    const reports = [
      {
        id: 1,
        title: 'Trasig gatubelysning',
        location: 'Stora Torget, Stockholm',
        date: '2025-04-01',
        status: 'Under behandling',
        statusClass: 'in-progress',
        statusIcon: refreshCircle,
        icon: documentOutline,
        iconClass: 'electricity',
        isCompleted: false
      },
      {
        id: 2,
        title: 'Potthål i vägbanan',
        location: 'Kungsgatan, Stockholm',
        date: '2025-04-03',
        status: 'Väntar på granskning',
        statusClass: 'new',
        statusIcon: timeIcon,
        icon: alertCircleOutline,
        iconClass: 'maintenance',
        isCompleted: false
      },
      {
        id: 3,
        title: 'Trasig parkbänk',
        location: 'Stadsparken, Stockholm',
        date: '2025-03-15',
        status: 'Åtgärdat',
        statusClass: 'resolved',
        statusIcon: checkmarkCircleOutline,
        icon: gridOutline,
        iconClass: 'retail',
        isCompleted: true
      }
    ];
    
    // Filter reports based on active tab
    const activeReports = computed(() => {
      return reports.filter(report => !report.isCompleted);
    });
    
    const completedReports = computed(() => {
      return reports.filter(report => report.isCompleted);
    });
    
    const allReports = computed(() => {
      return reports;
    });
    
    // Function to navigate to report details
    const openReportDetails = (report) => {
      console.log('Opening report details for:', report.title);
      router.push(`/reports/${report.id}`);
    };
    
    // Helper functions
    const getTimeAgo = (date) => {
      const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
      if (days === 0) return 'idag';
      if (days === 1) return '1 dag sedan';
      return `${days} dagar sedan`;
    };
    
    const getCompletionTime = (date) => {
      return Math.floor(Math.random() * 14) + 1;
    };
    
    return {
      activeTab,
      activeReports,
      completedReports,
      allReports,
      openReportDetails,
      getTimeAgo,
      getCompletionTime,
      
      // Icons
      documentTextOutline,
      documentOutline,
      checkmarkCircleOutline,
      checkmarkOutline,
      locationOutline,
      timeOutline,
      arrowForwardOutline,
      addOutline,
      refreshCircle,
      timeIcon,
      alertCircleOutline,
      gridOutline
    };
  }
});
