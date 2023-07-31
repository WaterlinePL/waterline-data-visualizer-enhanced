<template>
  <div class="content__map">
    <l-map :zoom="zoom" :center="center" ref="map">
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker v-for="(point, index) in points" :key="index" :lat-lng="point.latlng" :icon="getCustomIcon()"></l-marker>
    </l-map>
    <div class="content__map-scale">
      <div class="map-scale__scale-value">
        <p class="scale-value__value scale-value__value--top">143.20</p>
        <p class="scale-value__unit scale-value__unit--top">[mm]</p>
      </div>
      <div class="map-scale__wrapper">
        <div class="map-scale__scale-bar"></div>
      </div>
      <div class="map-scale__scale-value">
        <p class="scale-value__value scale-value__value--low">0.00</p>
        <p class="scale-value__unit scale-value__unit--low">[mm]</p>
      </div>
    </div>
  </div>
  <div class="content__controllers">
    <div class="controllers__dates">
      <div class="dates__date">
        <p class="date__label date__label--left">Animation Start</p>
        <p class="date__time">Aug 4, 2021, 12:00:00 AM</p>
      </div>
      <div class="dates__date">
        <p class="date__label date__label--center">Now</p>
        <p class="date__time">Aug 11, 2021, 12:00:00 AM</p>
      </div>
      <div class="dates__date">
        <p class="date__label date__label--right">Animation End</p>
        <p class="date__time">Aug 31, 2021, 12:00:00 AM</p>
      </div>
    </div>
    <div class="controllers__progress-bar">
      <ProgressBar :value="progress_value"></ProgressBar>
    </div>
    <div class="controllers__controls">
      <Button class="controls__button controls__button--play" icon="pi pi-play" rounded aria-label="Play" />
      <Button class="controls__button controls__button--pause" icon="pi pi-pause" rounded aria-label="Pause" />
      <Button class="controls__button  controls__button--stop" icon="pi pi-stop" severity="danger" rounded aria-label="Stop" />
    </div>
  </div>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.js";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import { ref } from "vue";
import * as L from "leaflet";

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
let zoom = 6;
let center = [51.19066, 18.6592];

const progress_value = ref(35);

const points = ref([
  {
    "id": "250180460",
    "stationName": "ADAMOWICE",
    "value": "95414",
    "latlng": [51.94225, 20.45963]
  },
  {
    "id": "254230010",
    "stationName": "ALEKSANDRÓWKA",
    "value": "91908",
    "latlng": [51.19066, 18.6592]
  },
  {
    "id": "250190430",
    "stationName": "ALWERNIA",
    "value": "95506",
    "latlng": [50.094818, 19.526965]
  },
  {
    "id": "250210030",
    "stationName": "ANNOPOL",
    "value": "95751",
    "latlng": [52.4311, 21.70172]
  },
  {
    "id": "249199978",
    "stationName": "ANTAŁÓWKA",
    "value": "6522",
    "latlng": [51.99605, 19.488789]
  },
  {
    "id": "253229988",
    "stationName": "AUGUSTÓW",
    "value": "92838",
    "latlng": [53.845199, 22.976711]
  },
  {
    "id": "252189994",
    "stationName": "BABIAK",
    "value": "93420",
    "latlng": [52.349501, 18.689911]
  },
  {
    "id": "253210080",
    "stationName": "BABIĘTA",
    "value": "92730",
    "latlng": [53.6737, 21.2582]
  },
  {
    "id": "252159995",
    "stationName": "BABIMOST",
    "value": "3150",
    "latlng": [52.157698, 15.774791]
  },
  {
    "id": "252150270",
    "stationName": "BABIMOST",
    "value": "3152",
    "latlng": [52.157698, 15.774791]
  },
  {
    "id": "252150270",
    "stationName": "BABIMOST",
    "value": "93152",
    "latlng": [52.157698, 15.774791]
  },
  {
    "id": "250170410",
    "stationName": "BABORÓW",
    "value": "95418",
    "latlng": [50.119082, 17.992786]
  },
  {
    "id": "252179999",
    "stationName": "BACHORZEW",
    "value": "93301",
    "latlng": [51.99503, 17.56113]
  },
  {
    "id": "253220260",
    "stationName": "BACIUTY",
    "value": "92803",
    "latlng": [53.05407, 22.98342]
  },
  {
    "id": "253220350",
    "stationName": "BACZE SUCHE",
    "value": "92854",
    "latlng": [53.06804, 22.11501]
  },
  {
    "id": "254220080",
    "stationName": "BAKAŁARZEWO",
    "value": "91804",
    "latlng": [54.09398, 22.65218]
  },
  {
    "id": "250209983",
    "stationName": "BALICE",
    "value": "95632",
    "latlng": [50.54453, 20.83437]
  },
  {
    "id": "249220170",
    "stationName": "BALIGRÓD-MCHAWA",
    "value": "6808",
    "latlng": [49.35845, 22.2813]
  },
  {
    "id": "253199991",
    "stationName": "BAŁOSZYCE",
    "value": "92532",
    "latlng": [53.67444, 19.28169]
  },
  {
    "id": "254220060",
    "stationName": "BANIE MAZURSKIE",
    "value": "91813",
    "latlng": [54.245605, 22.043496]
  },
  {
    "id": "249190620",
    "stationName": "BAŃSKA WYŻNA",
    "value": "96510",
    "latlng": [49.4, 20.0]
  },
  {
    "id": "251189997",
    "stationName": "BARANÓW",
    "value": "94412",
    "latlng": [51.238275, 17.975431]
  },
  {
    "id": "250210150",
    "stationName": "BARANÓW SANDOMIERSKI",
    "value": "95733",
    "latlng": [50.462418, 21.60216]
  },
  {
    "id": "250210070",
    "stationName": "BARANÓWEK",
    "value": "95754",
    "latlng": [50.77539, 21.2491]
  },
  {
    "id": "254210010",
    "stationName": "BARCIANY",
    "value": "91708",
    "latlng": [54.21993, 21.35347]
  },
  {
    "id": "252179999",
    "stationName": "BARCIN",
    "value": "93355",
    "latlng": [52.855878, 17.942547]
  },
  {
    "id": "250160410",
    "stationName": "BARDO ŚLĄSKIE",
    "value": "95223",
    "latlng": [50.506473, 16.736173]
  },
  {
    "id": "253159992",
    "stationName": "BARLINEK",
    "value": "92101",
    "latlng": [52.997583, 15.211757]
  },
  {
    "id": "253229994",
    "stationName": "BARSZCZOWA GÓRA",
    "value": "92843",
    "latlng": [53.96865, 22.97199]
  },
  {
    "id": "250200010",
    "stationName": "BARTKÓW",
    "value": "95653",
    "latlng": [51.51429, 16.77274]
  },
  {
    "id": "249210170",
    "stationName": "BARTNE",
    "value": "96717",
    "latlng": [49.55879, 21.34309]
  },
  {
    "id": "251210090",
    "stationName": "BARTODZIEJE",
    "value": "94723",
    "latlng": [51.11667, 19.46667]
  },
  {
    "id": "254200040",
    "stationName": "BARTOSZYCE",
    "value": "91613",
    "latlng": [54.252916, 20.811096]
  },
  {
    "id": "252190080",
    "stationName": "BARUCHOWO",
    "value": "93524",
    "latlng": [52.489331, 19.29498]
  },
  {
    "id": "253160050",
    "stationName": "BARWICE",
    "value": "92226",
    "latlng": [53.786592, 16.2863]
  },
  {
    "id": "249210240",
    "stationName": "BARWINEK",
    "value": "6708",
    "latlng": [49.43457, 21.68963]
  },
  {
    "id": "251210270",
    "stationName": "BASINÓW",
    "value": "94744",
    "latlng": [51.6932, 21.35622]
  },
  {
    "id": "250229988",
    "stationName": "BATORZ",
    "value": "95844",
    "latlng": [50.855679, 22.4788]
  },
  {
    "id": "253190290",
    "stationName": "BĄGART",
    "value": "92555",
    "latlng": [53.96618, 19.35988]
  },
  {
    "id": "254180120",
    "stationName": "BĄKOWO",
    "value": "91419",
    "latlng": [53.11667, 17.25]
  },
  {
    "id": "250180010",
    "stationName": "BĄKÓW",
    "value": "95484",
    "latlng": [52.15414, 19.71737]
  },
  {
    "id": "250209976",
    "stationName": "BELINA",
    "value": "95654",
    "latlng": [52.450809, 21.910495]
  },
  {
    "id": "251190110",
    "stationName": "BEŁCHATÓW",
    "value": "94555",
    "latlng": [51.358191, 19.368433]
  },
  {
    "id": "251199995",
    "stationName": "BEŁCHATÓW",
    "value": "4505",
    "latlng": [51.358191, 19.368433]
  },
  {
    "id": "250239995",
    "stationName": "BEŁŻEC",
    "value": "95908",
    "latlng": [50.370596, 23.428497]
  },
  {
    "id": "249209976",
    "stationName": "BEREST",
    "value": "96619",
    "latlng": [49.50208, 20.97046]
  },
  {
    "id": "249219988",
    "stationName": "BESKO",
    "value": "96720",
    "latlng": [49.58954, 21.957585]
  },
  {
    "id": "251230120",
    "stationName": "BEZEK",
    "value": "4902",
    "latlng": [51.20151, 23.26986]
  },
  {
    "id": "254219997",
    "stationName": "BEZŁAWKI-WILKOWO",
    "value": "91702",
    "latlng": [52.88427, 22.81841]
  },
  {
    "id": "253219994",
    "stationName": "BĘSIA",
    "value": "2751",
    "latlng": [51.99605, 19.488789]
  },
  {
    "id": "252169989",
    "stationName": "BIAŁA NAD NOTECIĄ",
    "value": "93250",
    "latlng": [53.84635, 16.82663]
  },
  {
    "id": "251189992",
    "stationName": "BIAŁA NAD WARTĄ",
    "value": "94413",
    "latlng": [51.760276, 18.615416]
  },
  {
    "id": "253229990",
    "stationName": "BIAŁA PISKA",
    "value": "92825",
    "latlng": [53.675333, 22.10469]
  },
  {
    "id": "252239995",
    "stationName": "BIAŁA PODLASKA",
    "value": "3903",
    "latlng": [52.038712, 23.112799]
  },
  {
    "id": "251209995",
    "stationName": "BIAŁA RAWSKA",
    "value": "94636",
    "latlng": [51.848873, 20.540568]
  },
  {
    "id": "252140180",
    "stationName": "BIAŁCZYK",
    "value": "93053",
    "latlng": [51.99605, 19.488789]
  },
  {
    "id": "249200450",
    "stationName": "BIAŁKA TATRZAŃSKA",
    "value": "96610",
    "latlng": [49.394186, 20.104997]
  },
  {
    "id": "251200080",
    "stationName": "BIAŁOBRZEGI",
    "value": "94630",
    "latlng": [51.646366, 20.949569]
  },
  {
    "id": "253220040",
    "stationName": "BIAŁOBRZEGI",
    "value": "92832",
    "latlng": [51.646366, 20.949569]
  },
  {
    "id": "254159998",
    "stationName": "BIAŁOGARD",
    "value": "1101",
    "latlng": [54.011052, 15.984654]
  },
  {
    "id": "253179993",
    "stationName": "BIAŁOŚLIWIE",
    "value": "92304",
    "latlng": [53.101647, 17.12486]
  },
  {
    "id": "252230120",
    "stationName": "BIAŁOWIEŻA",
    "value": "3902",
    "latlng": [52.73467, 21.05215]
  },
  {
    "id": "353230295",
    "stationName": "BIAŁYSTOK",
    "value": "295",
    "latlng": [53.138198, 23.173944]
  },
  {
    "id": "253220070",
    "stationName": "BIEBRZA-PIEŃCZYKÓWEK",
    "value": "2802",
    "latlng": [53.64454, 22.6066]
  },
  {
    "id": "249210070",
    "stationName": "BIECZ-GRUDNA",
    "value": "6702",
    "latlng": [52.42147, 16.07588]
  },
  {
    "id": "250170350",
    "stationName": "BIELICE",
    "value": "95309",
    "latlng": [53.193376, 14.749404]
  },
  {
    "id": "252149998",
    "stationName": "BIELINEK",
    "value": "93024",
    "latlng": [52.94279, 14.1549]
  },
  {
    "id": "250200060",
    "stationName": "BIELINY KAPITULNE",
    "value": "95646",
    "latlng": [50.445005, 22.294855]
  },
  {
    "id": "252239998",
    "stationName": "BIELSK PODLASKI",
    "value": "3901",
    "latlng": [52.775495, 23.190326]
  },
  {
    "id": "349190600",
    "stationName": "BIELSKO-BIAŁA",
    "value": "600",
    "latlng": [49.808294, 19.042013]
  },
  {
    "id": "249199993",
    "stationName": "BIEŃKÓWKA",
    "value": "96557",
    "latlng": [49.88333, 19.61667]
  },
  {
    "id": "251150320",
    "stationName": "BIERNA",
    "value": "94107",
    "latlng": [51.02814, 15.12101]
  },
  {
    "id": "250190380",
    "stationName": "BIERUŃ STARY",
    "value": "5508",
    "latlng": [49.72792, 19.17046]
  },
  {
    "id": "251170270",
    "stationName": "BIERUTÓW",
    "value": "94306",
    "latlng": [51.128283, 17.544936]
  },
  {
    "id": "250170020",
    "stationName": "BIESTRZYKOWICE",
    "value": "95357",
    "latlng": [50.99011, 17.76346]
  },
  {
    "id": "252199990",
    "stationName": "BIEŻUŃ",
    "value": "93541",
    "latlng": [52.966183, 19.944983]
  },
  {
    "id": "250229990",
    "stationName": "BIŁGORAJ",
    "value": "5803",
    "latlng": [50.535886, 22.725143]
  },
  {
    "id": "253140080",
    "stationName": "BINOWO",
    "value": "92015",
    "latlng": [53.30646, 14.64839]
  },
  {
    "id": "249220060",
    "stationName": "BIRCZA",
    "value": "6803",
    "latlng": [49.676174, 22.448195]
  },
  {
    "id": "253190130",
    "stationName": "BISKUPIEC",
    "value": "92522",
    "latlng": [53.861275, 20.959126]
  },
  {
    "id": "253200030",
    "stationName": "BISKUPIEC",
    "value": "92652",
    "latlng": [53.861275, 20.959126]
  },
  {
    "id": "253209997",
    "stationName": "BISKUPIEC",
    "value": "2601",
    "latlng": [53.861275, 20.959126]
  },
  {
    "id": "252159994",
    "stationName": "BLEDZEW",
    "value": "93127",
    "latlng": [52.1488, 16.6747]
  },
  {
    "id": "250180450",
    "stationName": "BLINÓW",
    "value": "95017",
    "latlng": [51.92204, 20.74794]
  },
  {
    "id": "250220090",
    "stationName": "BŁASZKI",
    "value": "93742",
    "latlng": [52.10726, 19.49797]
  },
  {
    "id": "253209998",
    "stationName": "BŁĘKITNA",
    "value": "2603",
    "latlng": [53.1342, 19.44825]
  },
  {
    "id": "254230030",
    "stationName": "BŁĘKITNA GÓRA",
    "value": "91913",
    "latlng": [51.700128, 19.160664]
  },
  {
    "id": "254229996",
    "stationName": "BŁĘKITNA-PIANKI",
    "value": "91902",
    "latlng": [51.732124, 19.325719]
  },
  {
    "id": "253189996",
    "stationName": "BŁOTO",
    "value": "92503",
    "latlng": [54.019192, 19.43154]
  },
  {
    "id": "254200020",
    "stationName": "BŁUDNIKI",
    "value": "91706",
    "latlng": [54.15248, 21.03698]
  },
  {
    "id": "254160210",
    "stationName": "BŁUDOWO",
    "value": "91417",
    "latlng": [54.003307, 15.259951]
  },
  {
    "id": "249220230",
    "stationName": "BŁYSZCZÓW",
    "value": "96714",
    "latlng": [49.60705, 21.80479]
  },
  {
    "id": "251200080",
    "stationName": "BOBROWNIKI",
    "value": "94632",
    "latlng": [51.646366, 20.949569]
  },
  {
    "id": "251210140",
    "stationName": "BOBROWO",
    "value": "94728",
    "latlng": [52.927315, 19.726552]
  },
  {
    "id": "250190040",
    "stationName": "BOCHNIA",
    "value": "95909",
    "latlng": [49.966518, 20.425109]
  },
  {
    "id": "249190610",
    "stationName": "BOCHNIA",
    "value": "96512",
    "latlng": [49.966518, 20.425109]
  },
  {
    "id": "253140010",
    "stationName": "BOCK",
    "value": "92016",
    "latlng": [53.406183, 14.484418]
  },
  {
    "id": "253150040",
    "stationName": "BOLESZCZYCE",
    "value": "92126",
    "latlng": [52.92163, 15.11927]
  },
  {
    "id": "253149993",
    "stationName": "BOLESZYN",
    "value": "94113",
    "latlng": [51.99605, 19.488789]
  },
  {
    "id": "250160120",
    "stationName": "BOLESŁAW",
    "value": "95253",
    "latlng": [50.75615, 16.8242]
  },
  {
    "id": "253209999",
    "stationName": "BOLKOWO",
    "value": "2604",
    "latlng": [52.9831, 17.65495]
  },
  {
    "id": "254199994",
    "stationName": "BOLKÓW",
    "value": "91500",
    "latlng": [50.914625, 21.0039]
  },
  {
    "id": "253209994",
    "stationName": "BORKI",
    "value": "92500",
    "latlng": [52.689247, 19.070787]
  },
  {
    "id": "253199998",
    "stationName": "BOROWA GÓRA",
    "value": "92544",
    "latlng": [53.172722, 19.369144]
  },
  {
    "id": "250210140",
    "stationName": "BOROWIEC",
    "value": "95737",
    "latlng": [50.462418, 21.60216]
  },
  {
    "id": "251190080",
    "stationName": "BOROWIEC",
    "value": "94557",
    "latlng": [51.99605, 19.488789]
  },
  {
    "id": "253210070",
    "stationName": "BOROWIEC",
    "value": "92706",
    "latlng": [53.150536, 20.100318]
  },
  {
    "id": "250209983",
    "stationName": "BOROWIEC",
    "value": "95651",
    "latlng": [50.54453, 20.83437]
  },
  {
    "id": "253159995",
    "stationName": "BOROWO",
    "value": "92108",
    "latlng": [52.94123, 15.74182]
  },
  {
    "id": "250180220",
    "stationName": "BORÓW",
    "value": "95403",
    "latlng": [52.52514, 20.95634]
  },
  {
    "id": "250150300",
    "stationName": "BORÓW",
    "value": "93102",
    "latlng": [52.81614, 16.73398]
  },
  {
    "id": "252219997",
    "stationName": "BORÓWKA",
    "value": "91602",
    "latlng": [52.78666, 21.60098]
  },
  {
    "id": "252220100",
    "stationName": "BORÓWKA KOLONIA",
    "value": "94035",
    "latlng": [52.736718, 21.60471]
  },
  {
    "id": "250160030",
    "stationName": "BORUCZYN",
    "value": "95047",
    "latlng": [50.563177, 16.98595]
  },
  {
    "id": "250200470",
    "stationName": "BORUCZYŃSKA",
    "value": "95507",
    "latlng": [50.60304, 22.16112]
  },
  {
    "id": "253149996",
    "stationName": "BORYCHOWO",
    "value": "94115",
    "latlng": [51.99605, 19.488789]
  },
  {
    "id": "252190180",
    "stationName": "BORYSZEW",
    "value": "93509",
    "latlng": [52.388648, 18.585137]
  },
  {
    "id": "253229996",
    "stationName": "BORYSZEW-KOLONIA",
    "value": "92827",
    "latlng": [52.40867, 18.59597]
  },
  {
    "id": "252189992",
    "stationName": "BORYSZEWICE",
    "value": "93510",
    "latlng": [52.526247, 18.362731]
  },
  {
    "id": "254239993",
    "stationName": "BORYSZEW-KRAKÓWIECKA",
    "value": "91805",
    "latlng": [52.55973, 19.6745]
  },
  {
    "id": "251210070",
    "stationName": "BORYSZEW-SZCZUKOWO",
    "value": "94712",
    "latlng": [52.91087, 19.58036]
  },
  {
    "id": "250220110",
    "stationName": "BOŚNIA",
    "value": "93744",
    "latlng": [51.94276, 19.78823]
  },
  {
    "id": "250180470",
    "stationName": "BOTOŚWIEC",
    "value": "95014",
    "latlng": [52.141123, 20.621783]
  },
  {
    "id": "251199998",
    "stationName": "BOTRZÓW",
    "value": "94653",
    "latlng": [51.99605, 19.488789]
  },
  {
    "id": "251209998",
    "stationName": "BOTRZÓW",
    "value": "94654",
    "latlng": [51.99605, 19.488789]
  },
  {
    "id": "254190010",
    "stationName": "BOTUCZ",
    "value": "91315",
    "latlng": [52.936276, 17.726235]
  },
  {
    "id": "254200070",
    "stationName": "BRANIEWO",
    "value": "91722",
    "latlng": [54.24895, 19.81895]
  },
  {
    "id": "253209990",
    "stationName": "BRASTRA",
    "value": "92501",
    "latlng": [53.21173, 19.06077]
  },
  {
    "id": "254199993",
    "stationName": "BRODNICA",
    "value": "91503",
    "latlng": [53.24935, 19.383227]
  },
  {
    "id": "250170060",
    "stationName": "BRONISZEWICE",
    "value": "95365",
    "latlng": [52.36221, 17.93192]
  },
  {
    "id": "253219995",
    "stationName": "BRODNICA KOCIEWSKA",
    "value": "2755",
    "latlng": [51.99605, 19.488789]
  },
  {
    "id": "252219995",
    "stationName": "BRODNIKI",
    "value": "91617",
    "latlng": [52.72393, 21.70284]
  },
  {
    "id": "253220010",
    "stationName": "BRODNIKI",
    "value": "92833",
    "latlng": [51.848873, 20.540568]
  },
  {
    "id": "254230010",
    "stationName": "BRODY-PIANKI",
    "value": "91902",
    "latlng": [51.732124, 19.325719]
  },
  {
    "id": "254220080",
    "stationName": "BRODY SZLACHECKIE",
    "value": "91706",
    "latlng": [54.15248, 21.03698]
  },
  {
    "id": "252159996",
    "stationName": "BRONISZEWICE",
    "value": "93102",
    "latlng": [52.81614, 16.73398]
  },
  {
    "id": "250190480",
    "stationName": "BRONOWICE",
    "value": "95910",
    "latlng": [49.93888, 19.22254]
  },
  {
    "id": "254190270",
    "stationName": "BROŃSKI",
    "value": "91304",
    "latlng": [52.90852, 17.98265]
  },
  {
    "id": "254190040",
    "stationName": "BRONÓW",
    "value": "91313",
    "latlng": [52.94949, 17.78538]
  },
  {
    "id": "250180310",
    "stationName": "BROUWERSHAVEN",
    "value": "95431",
    "latlng": [51.688057, 20.131375]
  },
  {
    "id": "254190260",
    "stationName": "BRUDZICE",
    "value": "91318",
    "latlng": [53.01827, 17.81613]
  },
  {
    "id": "250209991",
    "stationName": "BRUJNÓW",
    "value": "95634",
    "latlng": [50.47616, 20.92153]
  },
  {
    "id": "254189994",
    "stationName": "BRUKSELA",
    "value": "91308",
    "latlng": [52.67657, 18.98426]
  },
  {
    "id": "253209999",
    "stationName": "BRUKSELA",
    "value": "2605",
    "latlng": [53.17936, 17.43102]
  },
  {
    "id": "252220160",
    "stationName": "BRULINO",
    "value": "94734",
    "latlng": [52.805347, 21.683667]
  },
  {
    "id": "250180470",
    "stationName": "BRWINÓW",
    "value": "95014",
    "latlng": [52.141123, 20.621783]
  },
  {
    "id": "252220050",
    "stationName": "BRZEG",
    "value": "94013",
    "latlng": [52.8662, 21.62138]
  },
  {
    "id": "251209997",
    "stationName": "BRZEG",
    "value": "94651",
    "latlng": [52.8662, 21.62138]
  },
  {
    "id": "254209999",
    "stationName": "BRZEG DOLNY",
    "value": "91501",
    "latlng": [51.29651, 16.74841]
  },
  {
    "id": "253209996",
    "stationName": "BRZEGI",
    "value": "2606",
    "latlng": [53.10885, 18.71295]
  },
  {
    "id": "253209991",
    "stationName": "BRZEGI DOLNE",
    "value": "2607",
    "latlng": [53.15149, 17.66216]
  },
  {
    "id": "251210160",
    "stationName": "BRZEGI-KOLANOWICE",
    "value": "94737",
    "latlng": [53.04397, 19.71212]
  },
  {
    "id": "254220070",
    "stationName": "BRZEŹNO",
    "value": "91710",
    "latlng": [54.06208, 21.22587]
  },
  {
    "id": "252229998",
    "stationName": "BRZEZIE",
    "value": "94023",
    "latlng": [52.543073, 18.890076]
  },
  {
    "id": "254200030",
    "stationName": "BRZEŹNO ELBLĄSKIE",
    "value": "91704",
    "latlng": [54.15248, 21.03698]
  },
  {
    "id": "254220150",
    "stationName": "BRZEŹNO SZCZUCIŃSKIE",
    "value": "91623",
    "latlng": [54.115505, 21.142863]
  },
  {
    "id": "253220100",
    "stationName": "BRZEŹNO-KOLONIA",
    "value": "92812",
    "latlng": [52.875843, 20.3973]
  },
  {
    "id": "254229995",
    "stationName": "BRZEZOWKA",
    "value": "91500",
    "latlng": [50.914625, 21.0039]
  },
  {
    "id": "253189999",
    "stationName": "BRZEZÓWKA",
    "value": "92403",
    "latlng": [53.94126, 19.57833]
  },
  {
    "id": "253150010",
    "stationName": "BRZEG",
    "value": "92102",
    "latlng": [52.51801, 15.82311]
  },
  {
    "id": "253209999",
    "stationName": "BRZESKO",
    "value": "2608",
    "latlng": [49.97398, 19.13329]
  },
  {
    "id": "250160060",
    "stationName": "BRZEZOWO",
    "value": "95250",
    "latlng": [50.546075, 16.973442]
  },
  {
    "id": "250180110",
    "stationName": "BRZOSTEK",
    "value": "95371",
    "latlng": [49.967543, 21.070032]
  },
  {
    "id": "250200430",
    "stationName": "BRZOSTEK-TRZCIONKA",
    "value": "95503",
    "latlng": [50.02764, 21.0975]
  },
  {
    "id": "252140220",
    "stationName": "BRZOSTKÓW",
    "value": "93058",
    "latlng": [52.69957, 19.43482]
  },
  {
    "id": "251200210",
    "stationName": "BRZOSTÓWKA",
    "value": "94704",
    "latlng": [51.83469, 20.0942]
  },
  {
    "id": "250220120",
    "stationName": "BRZÓZA",
    "value": "93745",
    "latlng": [51.89857, 19.83702]
  },
  {
    "id": "254210040",
    "stationName": "BRZÓZA KRÓLEWSKA",
    "value": "91707",
    "latlng": [51.491173, 18.545838]
  }
]);

function getCustomIcon() {
  const iconHTML = `
    <div style="width: 32px; height: 32px; display: flex;">
      <div style="flex: 1; background-color: red"></div>
      <div style="flex: 1; background-color: green"></div>
      <div style="flex: 1; background-color: blue"></div>
      <div style="flex: 1; background-color: pink"></div>
      <div style="flex: 1; background-color: yellow"></div>
    </div>
  `;
  return L.divIcon({
    html: iconHTML,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}
</script>

<style>
.content__map {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  min-height: 800px;
}

.content__map-scale {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 1rem;

}
.map-scale__wrapper {
  display: flex;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  padding: .75rem 0;
}

.map-scale__scale-bar {
  height: 100%;
  width: 70%;
  background: linear-gradient(#896DB8, #673AB7);
}

.map-scale__scale-value {
  display: flex;
  flex-direction: column;
}

.scale-value__value,
.scale-value__unit {
  font-weight: bold;
}

.content__controllers {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
}

.controllers__progress-bar .p-progressbar {
  height: 10px;
}

.controllers__dates {
  display: flex;
  flex-direction: row;
  margin: 0.5rem 0;
  justify-content: space-between;
}

.controls__button {
  margin: 1rem 0.25rem !important;
}

.date__label {
  font-size: 0.75rem;
  text-align: left;
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 0.25rem;
}

.date__label--left {
  text-align: left;
}

.date__label--center {
  text-align: center;
}

.date__label--right {
  text-align: right;
}
</style>
