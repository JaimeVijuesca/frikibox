import Hero from '../components/hero';
import HowItWorks from '../components/how-it-works';
import ProductGallery from '../components/product-gallery';
import ThemedBoxes from '../components/themed-boxes';

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ThemedBoxes />
      <ProductGallery />
    </>
  );
}
