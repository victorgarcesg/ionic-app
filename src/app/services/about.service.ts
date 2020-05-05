import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AboutService {

    constructor() {}

    getAboutInformation() {
      return {
        'headerTitle': 'Acerca de',
        'title': 'Vamos Juntos RD',
        'titleImage': '../assets/imgs/logo.png',
        'subtitle': 'La unión hace la fuerza, y los dominicanos juntos pueden contra todo, por eso fue creado este proyecto para unir' +
        ' a la población durante los tiempos dificiles que puede sobrellevar, medio de control de unidades e información de la comunidad' +
        ' para la comunidad.',
        'items': [
          {
            'title': 'Diagnóstico basico del COVID-19',
            'icon': '../assets/imgs/checkmark.png',
          },
          {
            'title': 'Boletines de información sobre la situación',
            'icon': '../assets/imgs/checkmark.png',
          },
          {
            'title': 'Recomendaciones de profesionales',
            'icon': '../assets/imgs/checkmark.png',
          },
          {
            'title': 'Emisiones de información gubernamental sobre la situación',
            'icon': '../assets/imgs/checkmark.png',
          }
        ]
      };
    }
}
