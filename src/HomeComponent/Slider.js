import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

import './Slider.css'; // Custom styles for the slider

const Slider = () => {
  return (
    <Swiper
      effect="fade"
      modules={[EffectFade, Navigation, Autoplay]}
      navigation
      autoplay={{ delay: 5000 }}
      loop={true}
      fadeEffect={{ crossFade: true }}
      className="mySwiper"
    >
      <SwiperSlide>
        <div className="slide-content">
          <h2>Learn Sign Language, Connect Globally</h2>
          <p>Join our platform to master sign language and communicate inclusively with millions.</p>
          <button className="discover-btn">Start Learning</button>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="slide-content">
          <h2>Empower Communication with Interactive Lessons</h2>
          <p>Engage with expertly designed courses tailored for all skill levels.</p>
          <button className="discover-btn">Explore Courses</button>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="slide-content">
          <h2>Build a Supportive Sign Language Community</h2>
          <p>Connect with learners and native signers to practice and grow together.</p>
          <button className="discover-btn">Join Community</button>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default Slider;