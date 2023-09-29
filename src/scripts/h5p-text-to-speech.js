import EasySpeech from 'easy-speech';
import { async } from 'regenerator-runtime';

export default class TextToSpeech extends H5P.EventDispatcher {
  /**
   * @constructor
   *
   * @param {object} params Parameters passed by the editor.
   * @param {number} contentId Content's id.
   * @param {object} [extras] Saved state, metadata, etc.
   */
  constructor(params, contentId, extras = {}) {
    super();

    const AUDIO_BUTTON = 'h5p-texttospeech-button';
    const SPEAK_BUTTON = 'h5p-texttospeech-speak';
    const PLAY_BUTTON = 'h5p-texttospeech-play';
    const ERROR_BUTTON = 'h5p-texttospeech-error';

    var element = document.createElement('button');
    element.classList.add(AUDIO_BUTTON, SPEAK_BUTTON);

    (async () => {
      // init
      await EasySpeech.init()
        .catch(e => {
          element.classList.remove(SPEAK_BUTTON);
          element.classList.add(ERROR_BUTTON);
        });

      // find voice
      var voice;
      var voices = EasySpeech.voices();
      var lang = params.language.substring(0, 2);

      for(var i = voices.length - 1; i >= 0; i--) {
        if (voices[i].lang.startsWith(lang)) {
          voice = voices[i];
          break;
        }
      }

      if (!voice) {
        // not supported
        element.classList.remove(SPEAK_BUTTON);
        element.classList.add(ERROR_BUTTON);
      } else {
        // add click event
        element.addEventListener('click', function(event) {
          if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            return;
          }
    
          (async () => {
            //speak
            await EasySpeech.speak({
              voice: voice,
              text: params.text,
              volume: params.volume,
              pitch: params.pitch,
              rate: params.rate,
              start: () => {
                element.classList.remove(SPEAK_BUTTON);
                element.classList.add(PLAY_BUTTON);
              },
              end: () => {
                element.classList.remove(PLAY_BUTTON);
                element.classList.add(SPEAK_BUTTON);
              }
            });
          })();
        });
      }
    })();

    /**
     * Attach library to wrapper.
     *
     * @param {jQuery} $wrapper Content's container.
     */
    this.attach = function ($wrapper) {
      $wrapper.get(0).classList.add('h5p-texttospeech-inner');
      $wrapper.get(0).appendChild(element);
    };
  }
}
