import { langCtrl } from "~/features/lang-selector/lang.ctrl"

const logoTxt = {
  alt: {
    fr: 'Musée du Jeu Vidéo',
    en: 'Video Game Museum',
  },
}

export const Logo = () => {

  const lang = langCtrl()
  return (
    <svg
      viewBox="0 0 14.6685 8.8132715"
      role="img"
      aria-label={logoTxt.alt[lang() as keyof typeof logoTxt.alt]}
      width="100"
      style={{ display: 'block', height: 'auto' }}
    >
      <title>Musée du Jeu Vidéo</title>
      <g transform="translate(-132.70577,-106.34605)" opacity="1">
        <animate attributeName="opacity" from="0" to="1" dur="0.6s" fill="freeze" begin="0s" />
        {/* Fond noir comme le logo original */}
        <rect x="132.77191" y="106.41219" width="14.536208" height="8.6809797" rx="0.76464587" fill="#000000" />
        {/* Rangée rouge */}
        <rect x="137.19046" y="109.42844" width="1.7885834" height="1.6245416" fill="#e73b21">
          <animateTransform attributeName="transform" type="translate" from="0 0.4" to="0 0" dur="0.5s" begin="0.12s" fill="freeze" />
        </rect>
        <rect x="139.14043" y="109.42844" width="1.7885834" height="1.6245416" fill="#e73b21">
          <animateTransform attributeName="transform" type="translate" from="0 0.4" to="0 0" dur="0.5s" begin="0.20s" fill="freeze" />
        </rect>
        <rect x="141.09041" y="109.42844" width="1.7885834" height="1.6245416" fill="#e73b21">
          <animateTransform attributeName="transform" type="translate" from="0 0.4" to="0 0" dur="0.5s" begin="0.28s" fill="freeze" />
        </rect>
        <rect x="143.03246" y="109.42844" width="1.7885834" height="1.6245416" fill="#e73b21">
          <animateTransform attributeName="transform" type="translate" from="0 0.4" to="0 0" dur="0.5s" begin="0.36s" fill="freeze" />
        </rect>
        <rect x="144.98244" y="109.42844" width="1.7885834" height="1.6245416" fill="#e73b21">
          <animateTransform attributeName="transform" type="translate" from="0 0.4" to="0 0" dur="0.5s" begin="0.44s" fill="freeze" />
        </rect>

        {/* Carrés fuchsia */}
        <rect x="143.03246" y="106.36986" width="1.7885834" height="1.6245416" fill="#e72a69">
          <animateTransform attributeName="transform" type="translate" from="0 0.4" to="0 0" dur="0.5s" begin="0.16s" fill="freeze" />
        </rect>
        <rect x="144.98244" y="107.67161" width="1.7885834" height="1.6245416" fill="#e72a69">
          <animateTransform attributeName="transform" type="translate" from="0 0.4" to="0 0" dur="0.5s" begin="0.24s" fill="freeze" />
        </rect>

        {/* Rangée orange */}
        <rect x="143.03246" y="111.21173" width="1.7885834" height="1.6245416" fill="#f39121">
          <animateTransform attributeName="transform" type="translate" from="0 0.4" to="0 0" dur="0.5s" begin="0.22s" fill="freeze" />
        </rect>
        <rect x="144.98244" y="111.21173" width="1.7885834" height="1.6245416" fill="#f39121">
          <animateTransform attributeName="transform" type="translate" from="0 0.4" to="0 0" dur="0.5s" begin="0.30s" fill="freeze" />
        </rect>
        <rect x="141.09041" y="111.21173" width="1.7885834" height="1.6245416" fill="#f39121">
          <animateTransform attributeName="transform" type="translate" from="0 0.4" to="0 0" dur="0.5s" begin="0.38s" fill="freeze" />
        </rect>

        {/* Rangée cyan */}
        <rect x="143.03246" y="112.97121" width="1.7885834" height="1.6245416" fill="#03aad3">
          <animateTransform attributeName="transform" type="translate" from="0 0.4" to="0 0" dur="0.5s" begin="0.26s" fill="freeze" />
        </rect>
        <rect x="144.98244" y="112.97121" width="1.7885834" height="1.6245416" fill="#03aad3">
          <animateTransform attributeName="transform" type="translate" from="0 0.4" to="0 0" dur="0.5s" begin="0.34s" fill="freeze" />
        </rect>

        {/* Tracé texte blanc (conservé tel quel, styles simplifiés) */}
        <path d="m 145.24967,107.52608 h -0.26459 v -0.26458 h 0.26459 v 0.0265 h 0.0265 v 0.082 h -0.0265 v 0.0529 h 0.0265 v 0.0794 h -0.0265 z m -0.0794,-0.21431 h -0.082 v 0.0582 h 0.082 z m 0,0.10848 h -0.082 v 0.0529 h 0.082 z" fill="#ffffff" />
        <path d="m 145.62537,107.25885 v 0.11113 h -0.0264 v 0.0265 h -0.0265 v 0.0265 h -0.0556 v 0.10583 h -0.10584 v -0.10583 h -0.0529 v -0.0265 h -0.0265 v -0.0265 h -0.0291 v -0.10848 h 0.10848 v 0.0794 h 0.0265 v 0.0291 h 0.0529 v -0.0291 h 0.0265 v -0.0794 z" fill="#ffffff" />
        <path d="m 145.97462,107.44671 h -0.0265 v -0.0265 h -0.037 v -0.0265 h -0.0291 v 0.13229 h -0.10583 v -0.26458 h 0.10583 v 0.0265 h 0.0291 v 0.0265 h 0.0265 v 0.0265 h 0.0265 v -0.0265 h 0.0265 v -0.0265 h 0.0265 v -0.0265 h 0.10848 v 0.26458 h -0.10848 v -0.13229 h -0.0265 v 0.0265 h -0.0265 z" fill="#ffffff" />
        <path d="m 146.44029,107.49963 v 0.0264 h -0.24077 v -0.0264 h -0.0238 v -0.21432 h 0.0265 v -0.0265 h 0.23812 v 0.0265 h 0.0265 v 0.21432 z m -0.16139,-0.0265 h 0.082 v -0.1614 h -0.082 z" fill="#ffffff" />
        <path d="m 146.51173,107.42025 v -0.0265 h -0.0291 v -0.13494 h 0.29634 v 0.0529 h -0.18786 v 0.0582 h 0.1614 v 0.0265 h 0.0265 v 0.10583 h -0.0265 v 0.0265 h -0.26458 v -0.0529 h 0.18785 v -0.0529 z" fill="#ffffff" />

        {/* Cadre blanc */}
        <rect x="132.77191" y="106.41219" width="14.536208" height="8.6809797" rx="0.76464587" fill="none" stroke="#ffffff" stroke-width="0.132292" />

        {/* Gros tracés texte blancs */}
        <path d="m 134.26946,108.80667 h -0.16404 v -0.1614 h -0.1614 v 0.64823 h -0.65087 v -1.62454 h 0.48947 v 0.16404 h 0.1614 v 0.1614 h 0.1614 v 0.16933 h 0.16404 v -0.1614 h 0.16139 v -0.16139 h 0.12965 v -0.16404 h 0.52917 v 1.62454 h -0.65088 v -0.64823 h -0.16933 z" fill="#ffffff" />
        <path d="m 136.38612,108.97071 v -1.30175 h 0.65088 v 1.46314 h -0.1614 v 0.1614 h -1.46314 v -0.1614 h -0.16404 v -1.46314 h 0.65087 v 1.30175 z" fill="#ffffff" />
        <path d="m 137.35185,108.64527 v -0.16404 h -0.17198 V 107.833 h 0.1614 v -0.16404 h 1.62454 v 0.32544 h -1.13771 v 0.32543 h 0.97632 v 0.1614 h 0.16139 v 0.65087 h -0.16139 v 0.1614 h -1.62455 v -0.32279 h 1.13771 v -0.32544 z" fill="#ffffff" />
        <path d="m 140.27815,108.64527 h -0.48948 v 0.32544 h 1.14035 v 0.32279 h -1.63248 v -0.1614 h -0.16139 v -1.2991 h 0.16139 v -0.16404 h 1.62719 v 0.32544 h -1.14036 v 0.32543 h 0.48948 z m -0.48948,-1.46314 h 0.16404 v -0.16405 h 0.16139 v -0.16139 h 0.32544 v 0.32544 h -0.16139 v 0.16139 h -0.16405 v 0.16404 h -0.32543 z" fill="#ffffff" />
        <path d="m 142.22812,108.31983 v 0.32544 h -0.48683 v 0.32544 h 1.13771 v 0.32279 h -1.62719 v -0.1614 h -0.16139 v -1.2991 h 0.16139 v -0.16404 h 1.62719 v 0.32544 h -1.13771 v 0.32543 z" fill="#ffffff" />
        <path d="m 133.28785,111.05298 v -1.62719 h 1.46315 v 0.16404 h 0.1614 v 0.1614 h 0.16404 v 0.97631 h -0.16404 v 0.1614 h -0.1614 v 0.16404 z m 0.98161,-1.30175 h -0.32544 v 0.97631 h 0.32544 v -0.16139 h 0.16139 v -0.65088 h -0.16139 z" fill="#ffffff" />
        <path d="m 136.38612,110.72754 v -1.30175 h 0.65088 v 1.46315 h -0.1614 v 0.16404 h -1.46314 v -0.16404 h -0.16404 v -1.46315 h 0.65087 v 1.30175 z" fill="#ffffff" />
        <path d="m 133.93873,112.51083 h 0.48683 v -1.30175 h 0.65088 v 1.45257 h -0.16404 v 0.16404 h -1.46315 v -0.16404 h -0.1614 v -0.47625 h 0.65088 z" fill="#ffffff" />
        <path d="m 136.38612,111.8679 v 0.32543 h -0.48683 v 0.32544 h 1.13771 v 0.32544 h -1.62454 v -0.18256 h -0.16404 v -1.29911 h 0.16404 v -0.16404 h 1.62454 v 0.32544 h -1.13771 v 0.34396 z" fill="#ffffff" />
        <path d="m 138.32817,112.51083 v -1.30175 h 0.64823 v 1.45257 h -0.1614 v 0.16404 h -1.46315 v -0.16404 h -0.17198 v -1.46315 h 0.65088 v 1.30175 z" fill="#ffffff" />
        <path d="m 135.07644,112.97121 v 0.97367 h -0.16404 v 0.16404 h -0.1614 v 0.16139 h -0.1614 v 0.16404 h -0.16404 v 0.1614 h -1.13771 v -1.62454 h 0.65088 v 1.13771 h 0.16139 v -0.16404 h 0.16934 v -0.1614 h 0.16139 v -0.81227 z" fill="#ffffff" />
        <path d="m 137.02642,112.97121 v 0.32544 h -0.56886 v 0.97366 h 0.56886 v 0.32544 h -1.78859 v -0.32544 h 0.56886 v -0.97366 h -0.56886 v -0.32544 z" fill="#ffffff" />
        <path d="m 137.17987,114.59575 v -1.62454 h 1.46315 v 0.16139 h 0.16404 v 0.16405 h 0.1614 v 0.97366 h -0.1614 v 0.16404 h -0.16404 v 0.1614 z m 0.97632,-1.2991 h -0.32544 v 0.97366 h 0.32544 v -0.16139 h 0.16404 v -0.65352 h -0.16404 z" fill="#ffffff" />
        <path d="m 142.71496,114.43435 v 0.1614 h -1.46315 v -0.1614 h -0.16139 v -1.30175 h 0.16139 v -0.16139 h 1.46315 v 0.16139 h 0.16404 v 1.30175 z m -0.97367,-0.16404 h 0.48683 v -0.97366 h -0.48683 z" fill="#ffffff" />
        <polygon points="139.77,255.37 139.77,254.14 144.07,254.14 144.07,252.91 137.93,252.91 137.93,253.53 137.31,253.53 137.31,258.44 137.93,258.44 137.93,259.06 144.07,259.06 144.07,257.83 139.77,257.83 139.77,256.6 141.61,256.6 141.61,255.37 " fill="#ffffff" transform="matrix(0.26458333,0,0,0.26458333,102.8105,46.05544)" />
        <polygon points="141.61,251.78 141,251.78 141,252.4 144.07,252.4 144.07,246.26 137.31,246.26 137.31,252.4 139.77,252.4 139.77,251.17 140.38,251.17 140.38,250.56 141,250.56 141,249.94 142.23,249.94 142.23,251.17 141.61,251.17 " fill="#f39121" transform="matrix(0.26458333,0,0,0.26458333,102.8105,46.05544)" />
      </g>
    </svg>
  )
}