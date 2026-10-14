import sneakerImg from '../assets/images/sample_sneaker_1791971119207.jpg';
import portraitImg from '../assets/images/sample_portrait_1791971120561.jpg';
import catImg from '../assets/images/sample_cat_1791971120860.jpg';
import plantImg from '../assets/images/sample_plant_1791971120732.jpg';

export interface SampleImage {
  id: string;
  name: string;
  label: string;
  category: string;
  src: string;
  filename: string;
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'sneaker',
    name: 'Sneaker Product',
    label: 'Product Photography',
    category: 'E-Commerce',
    src: sneakerImg,
    filename: 'sample-sneaker.jpg',
  },
  {
    id: 'portrait',
    name: 'Outdoor Portrait',
    label: 'Studio Portrait',
    category: 'People',
    src: portraitImg,
    filename: 'sample-portrait.jpg',
  },
  {
    id: 'cat',
    name: 'Fluffy Cat',
    label: 'Pet Photography',
    category: 'Animals',
    src: catImg,
    filename: 'sample-cat.jpg',
  },
  {
    id: 'plant',
    name: 'Monstera Plant',
    label: 'Botanical / Interior',
    category: 'Objects',
    src: plantImg,
    filename: 'sample-plant.jpg',
  },
];

export async function fetchSampleAsFile(sample: SampleImage): Promise<File> {
  const response = await fetch(sample.src);
  const blob = await response.blob();
  return new File([blob], sample.filename, { type: blob.type || 'image/jpeg' });
}
