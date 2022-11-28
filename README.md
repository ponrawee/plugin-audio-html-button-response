# jsPsychPluginAudioHtmlResponse

A fairly flexible plugin for jsPsych for creating a trial that has audio with button responses.

## Usage

Load the plugin's stylesheet (`styles/jspsych-audio-html-button-response.css`) and main script (`dist/index.browser.js` or the minified version, which is smaller in size but not intelligible `dist/index.browser.min.js`) after loading jsPsych and its stylesheet. You can download these files separately, or download this whole repository and copy these files to your desired directories. To use, set the `type` of the trial to `jsPsychAudioHtmlButtonResponse`.

**To ensure that the plugin works correctly, please preload all audio files.**

## Parameters
| **Parameter**                  | **Type**                    | **Required?** | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|--------------------------------|-----------------------------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| stimulus                       | _string_                    | No            | HTML stimulus. Does not include the audio.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| choices                        | _array of strings_          | No            | An array of choice texts.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| audio\_stimulus                | _array of strings_          | No            | An array of paths to your audio files. Your stimulus audio files will be played sequentially from the first to last element of this array.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| audio\_choices                 | _array of array of strings_ | No            | A nested array of the same length as `choices`.  The _n_th element of the array is an array of paths to audio files associated with the _n_th choice. For example, setting this to `[["audio1.mp3"], ["audio2.mp3", "audio3.mp3"]]` will associate `["audio1.mp3"]` with the first choice, and `["audio2.mp3", "audio3.mp3"]` with the second choice.                                                                                                                                                                                                                                                                                                                                            |
| audio\_stimulus\_start\_delay  | _integer_                   | No            | The duration before the stimulus audio starts playing, in milliseconds. Defaults to **100**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| audio\_choice\_break\_duration | _integer_                   | No            | The duration of silence between stimulus audio files, in milliseconds. Defaults to **100**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| audio\_choice\_break\_duration | _integer_                   | No            | The duration of silence between audio files associated with a choice, in milliseconds. Currently does not allow choice-specific/position-specific customisation. Defaults to **100**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| audio\_stimulus\_autoplay      | _boolean_                   | No            | Whether to autoplay the audio stimulus. Defaults to **true**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| audio\_stimulus\_play\_button  | _boolean_                   | No            | Whether to display the play button for the audio stimulus along with the HTML stimulus. By default, the plugin will place the button at the end of the HTML. However, placing `%play_button%`  in the HTML stimulus forces the play button to show up in its place and overrides the default behaviour. Defaults to **false**                                                                                                                                                                                                                                                                                                                                                                    |
| audio\_choice\_play\_button    | _boolean_                   | No            | Whether to display the play button for the choice audio next to its corresponding choice (as set by `audio_choices`).  Unlike the stimulus play button, there is no option to place the button elsewhere.  It is however possible to do this by changing the code of the function `main_html()` that generates the HTML. Defaults to **true**.                                                                                                                                                                                                                                                                                                                                                   |
| button\_html                   | _string_                    | No            | The HTML template for the response button. `%choice%` represents the choice text given by `choices`. Defaults to `<button class="jspsych-btn">%choice%</button>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| play_button_text               | _string_                    | No            | The text inside the play button. Defaults to an SVG (vector graphic) that yields the play button shape.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| response\_ends\_trial          | _boolean_                   | No            | Whether to end the trial after a choice is chosen. Defaults to **true**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| audioend\_ends\_trial          | _boolean_                   | No            | Whether to end the trial after the audio stimulus finishes autoplaying.  Note the following issue (to be fixed): setting this and `audio_stimulus_play_button` to true at the same time can lead to inability to end the trial if the play button is clicked  before the autoplay ends. Defaults to **false**                                                                                                                                                                                                                                                                                                                                                                                    |
| trial\_duration                | _boolean_                   | No            | The duration of the whole trial, in milliseconds. If set, the trial will end after the specified time  regardless of whether any audio finishes playing.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| before\_choices                | _string_                    | No            | HTML to be inserted before each choice.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| after\_choices                 | _string_                    | No            | HTML to be inserted after each choice (and after the play button for that choice).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| enable\_buttons\_after\_audio  | _integer_                   | No            | The duration between the end of the audio stimulus autoplay and  when all the choices and all the play buttons are enabled, in milliseconds. If set to -1, the buttons will be enabled from the start. If set to 0 or more, the buttons will be disabled initially, but enabled after the stimulus finishes  autoplaying for the specified time (0 = immediately enable the buttons). By default, if there is no audio stimulus or `audio_stimulus_autoplay` is false, this is set to -1 (i.e., the buttons are enabled in the beginning if there is no autoplayed audio stimulus). Otherwise, this defaults to 0 (i.e., the buttons are only enabled after the autoplayed audio stimulus ends). |
| correct\_choice                | _integer_                   | No            | The index of the correct choice in `choices`. If this is set,  the class `correct` will be added to the correct choice after response,  and the class `incorrect` will be added to the chosen choice, if it is incorrect. Useful for creating a trial with feedback. Defaults to **false**.                                                                                                                                                                                                                                                                                                                                                                                                      |
| feedback\_duration             | _integer_                   | No            | The duration after a choice is chosen before the trial ends, given that it will end as a result of `response_ends_trial` being true, in milliseconds. To be used jointly with `correct_choice` to give feedback.  Has no effect if `correct_choice` is set to false. Defaults to **500**.                                                                                                                                                                                                                                                                                                                                                                                                        |
## Examples
See a working example in `examples/index.html`.

## License
MIT