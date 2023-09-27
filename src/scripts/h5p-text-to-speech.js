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

    const $ = H5P.jQuery;
    const AUDIO_BUTTON = 'h5p-texttospeech-button';
    const PLAY_BUTTON = 'h5p-texttospeech-play';

    this.element = $('<button/>', {
      'class': AUDIO_BUTTON + " " + PLAY_BUTTON,
      'aria-label': this.params.playAudio
    });

    /**
     * Attach library to wrapper.
     *
     * @param {jQuery} $wrapper Content's container.
     */
    this.attach = function ($wrapper) {
      $wrapper.get(0).classList.add('h5p-texttospeech-inner');
      $wrapper.get(0).appendChild(this.element);
    };
  }
}
