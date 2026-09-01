import { useRef } from "react";
import { useNavigate } from "react-router";

function Explore() {
  const navigate = useNavigate();
  const layer2Ref = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  const handlePointerDown = (e) => {
    if (!layer2Ref.current) return;

    isDown.current = true;
    startX.current = e.clientX;
    startScroll.current = layer2Ref.current.scrollLeft;
    layer2Ref.current.classList.add("dragging");
    layer2Ref.current.setPointerCapture?.(e.pointerId);
  };

  const stopDragging = () => {
    isDown.current = false;
    if (!layer2Ref.current) return;
    layer2Ref.current.classList.remove("dragging");
  };

  const handlePointerMove = (e) => {
    if (!isDown.current || !layer2Ref.current) return;
    e.preventDefault();

    const walked = e.clientX - startX.current;
    layer2Ref.current.scrollLeft = startScroll.current - walked;
  };
  return (
    <section id="explore_section">
      <section id="layer_1">
        <section id="part_1">
          <h1>SHOES OFF, OR SHOES ON?</h1>

          <p>
            We like our style fast and our looks lethal. Wrap your feet in
            something unforgettable.
          </p>
          <button id="explore_me_btn" onClick={() => navigate("/auth")}>
            Explore Platform
          </button>
        </section>

        <section id="part_2">
          <div className="my_photo_booth_img">
            <img
              src={`https://i.pinimg.com/1200x/99/38/5b/99385b74b9a0b645a224cee2a80d8ef5.jpg`}
              alt=""
            />
            <span>
              <h1>My Heading</h1>
              <p>My Heading</p>
            </span>
          </div>
          <div className="my_photo_booth_img">
            <img
              src={`https://i.pinimg.com/736x/0f/08/f7/0f08f768d6f78d6645ea3d1f5197d475.jpg`}
              alt=""
            />
            <span>
              <h1>My Heading</h1>
              <p>My Heading</p>
            </span>
          </div>
          <div className="my_photo_booth_img">
            <img
              src={`https://i.pinimg.com/1200x/d0/c3/28/d0c328fe842bce74b160a21c325978af.jpg`}
              alt=""
            />
            <span>
              <h1>My Heading</h1>
              <p>My Heading</p>
            </span>
          </div>
          <div className="my_photo_booth_img">
            <img
              src={`https://i.pinimg.com/1200x/ac/6c/b0/ac6cb01ffddff921c1520cd76c381a30.jpg`}
              alt=""
            />
            <span>
              <h1>My Heading</h1>
              <p>My Heading</p>
            </span>
          </div>
        </section>
      </section>

      <section
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerLeave={stopDragging}
        onPointerCancel={stopDragging}
        ref={layer2Ref}
        id="layer_2"
      >
        <section className="a_journey">
          <div className="a_journey">
            <img
              src="https://i.pinimg.com/1200x/39/1e/fc/391efcfb7e94a34ffaf3d572e79cd2aa.jpg"
              alt=""
            />
          </div>
          <div>
            <h2>A Mini Bold Heading</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
              sit fuga doloribus est deserunt itaque!
            </p>
            <button className="read_more">Read More</button>
          </div>
        </section>
        <section className="a_journey">
          <div className="a_journey">
            <img
              src="https://i.pinimg.com/736x/ac/f3/23/acf3233963a6a342f6868c9001b44c48.jpg"
              alt=""
            />
          </div>
          <div>
            <h2>A Mini Bold Heading</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
              sit fuga doloribus est deserunt itaque!
            </p>
            <button className="read_more">Read More</button>
          </div>
        </section>
        <section className="a_journey">
          <div className="a_journey">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80"
              alt="Sneaker close-up"
            />
          </div>
          <div>
            <h2>A Mini Bold Heading</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
              sit fuga doloribus est deserunt itaque!
            </p>
            <button className="read_more">Read More</button>
          </div>
        </section>
      </section>
    </section>
  );
}

export default Explore;
