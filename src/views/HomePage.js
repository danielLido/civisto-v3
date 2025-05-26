import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonAvatar
} from '@ionic/vue';
import {
  notificationsOutline,
  addOutline,
  chevronForwardOutline,
  chevronBackOutline,
  chevronDownOutline,
  flashOutline,
  cartOutline,
  locationOutline,
  timeOutline,
  arrowForwardOutline,
  documentTextOutline,
  cameraOutline,
  hammerOutline,
  checkmarkCircleOutline,
  micOutline,
  chatbubbleOutline,
  thumbsUpOutline,
  imagesOutline
} from 'ionicons/icons';

export default {
  name: 'HomePage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonAvatar
  },
  mounted() {
    // Auto-advance slider
    this.autoSlide = setInterval(() => {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      } else {
        this.currentStep = 0;
      }
    }, 10000);
  },
  beforeUnmount() {
    if (this.autoSlide) {
      clearInterval(this.autoSlide);
    }
  },
  data() {
    return {
      currentStep: 0,
      autoSlide: null,
      steps: [
        {
          icon: cameraOutline,
          iconClass: 'blue',
          title: 'Upptäck & Rapportera',
          description: 'Ta en bild av problemet och beskriv vad som behöver fixas. Vi hittar automatiskt din plats.',
          features: ['Automatisk GPS-positionering', 'Snabb fotografering', 'Enkel beskrivning']
        },
        {
          icon: flashOutline,
          iconClass: 'orange',
          title: 'Spåra & Följ',
          description: 'Din rapport skickas direkt till rätt kommunal avdelning. Följ framstegen i realtid.',
          features: ['Ärendenummer för uppföljning', 'Realtidsuppdateringar', 'Direktkommunikation']
        },
        {
          icon: checkmarkCircleOutline,
          iconClass: 'green',
          title: 'Lösning & Resultat',
          description: 'Se före- och efterbilder när problemet är löst. Ge feedback för att förbättra tjänsten.',
          features: ['Före/efter-dokumentation', 'Kvalitetsbedömning', 'Transparent process']
        }
      ],
      recentReports: [
        {
          id: '2847',
          icon: flashOutline,
          iconClass: 'electricity',
          title: 'Trasig gatubelysning',
          location: 'Kungsgatan 32, Stockholm',
          status: 'Under behandling',
          statusClass: 'in-progress',
          time: '2 timmar sedan'
        },
        {
          id: '2846',
          icon: cartOutline,
          iconClass: 'retail',
          title: 'Övergiven kundvagn',
          location: 'Götgatan 14, Stockholm',
          status: 'Åtgärdat',
          statusClass: 'resolved',
          time: 'Igår kl 14:30'
        },
        {
          id: '2845',
          icon: hammerOutline,
          iconClass: 'maintenance',
          title: 'Potthål i vägbanan',
          location: 'Sveavägen 88, Stockholm',
          status: 'Väntar på granskning',
          statusClass: 'new',
          time: '3 dagar sedan'
        }
      ],
      // Icons
      notificationsOutline,
      addOutline,
      chevronForwardOutline,
      chevronBackOutline,
      chevronDownOutline,
      flashOutline,
      cartOutline,
      locationOutline,
      timeOutline,
      arrowForwardOutline,
      documentTextOutline,
      cameraOutline,
      hammerOutline,
      checkmarkCircleOutline,
      micOutline,
      chatbubbleOutline,
      thumbsUpOutline,
      imagesOutline
    };
  },
  methods: {
    reportIssue() {
      console.log('Report Issue button clicked');
      this.$router.push('/report');
    },
    
    viewAllReports() {
      console.log('View All clicked');
      this.$router.push('/reports');
    },
    
    openReport(report) {
      console.log('Report card clicked:', report.title);
      this.$router.push(`/reports/${report.id}`);
    },
    
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    
    nextStep() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    }
  }
};
