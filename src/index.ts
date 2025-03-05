import CortiDictation from './CortiDictation';

if (!customElements.get('corti-dictation')) {
  customElements.define('corti-dictation', CortiDictation);
}

export default CortiDictation;
