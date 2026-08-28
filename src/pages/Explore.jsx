import { useRef } from "react";

function Explore() {
  const layer2Ref = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  const handlePointerDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX;
    startScroll.current = layer2Ref.current.scrollLeft;
    layer2Ref.current.classList.add("dragging");
  };

  const stopDragging = () => {
    isDown.current = false;
    layer2Ref.current.classList.remove("dragging");
  };

  const handlePointerMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const walked = e.pageX - startX.current;
    layer2Ref.current.scrollLeft = startScroll.current - walked;
  };
  return (
    <section id="explore_section">
      <section id="layer_1">
        <section id="part_1">
          <h1>SNEAKERS ARE IN STYLE</h1>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi,
            pariatur?
          </p>
          <button id="explore_me_btn">Explore Platform</button>
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
              src={`https://i.pinimg.com/736x/48/58/e9/4858e9a444db5ad1d44f4bcc74a5484f.jpg`}
              alt=""
            />
            <span>
              <h1>My Heading</h1>
              <p>My Heading</p>
            </span>
          </div>
          <div className="my_photo_booth_img">
            <img
              src={`https://i.pinimg.com/736x/48/58/e9/4858e9a444db5ad1d44f4bcc74a5484f.jpg`}
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
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        ref={layer2Ref}
        id="layer_2"
      >
        <section className="a_journey">
          <div className="a_journey">
            <img src="" alt="" />
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
            <img src="" alt="" />
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
            <img src="" alt="" />
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
            <img src="" alt="" />
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
            <img src="" alt="" />
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
