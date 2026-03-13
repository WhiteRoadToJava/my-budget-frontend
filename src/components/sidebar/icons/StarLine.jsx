import React, { useState, useEffect, useRef } from "react";
import styles from "src/components/layout/sidebar/sidebarIcons.module.scss";

const StarLine = ({ children, starPosition = 0.5, className = "" }) => {
  const [height, setHeight] = useState(0);
  const containerRef = useRef(null);
  const subMenuRef = useRef(null);

  useEffect(() => {
    const currentRef = subMenuRef.current; 

    const updateHeight = () => {
      if (currentRef) {
        const newHeight = currentRef.offsetHeight;
        setHeight(newHeight);
      }
    };

    // Initial measurement
    updateHeight();

    // Set up resize observer to handle dynamic content changes
    const resizeObserver = new ResizeObserver(updateHeight);

    if (currentRef) {
      resizeObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`${styles.flexDisplay} ${styles.className}`}>
      <svg
        width={10}
        height={height}
        viewBox={`0 0 10 ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.noFlexShrink}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={`M4 ${height}L4 0L4.5 0L4.5 ${height}L4 ${height}Z`}
          fill="#E7E7E7"
        />
        {height > 0 && (
          <path
            d={`M4.50666 ${height * starPosition - 5.5}C4.06754 ${
              height * starPosition - 0.9071
            } 3.71145 ${height * starPosition - 0.4665} 0 ${
              height * starPosition + 0.0769
            }C0.0076961 ${height * starPosition + 0.0782} 0.0153922 ${
              height * starPosition + 0.0793
            } 0.0230883 ${height * starPosition + 0.0804}H0.0232363C3.71278 ${
              height * starPosition + 0.6224
            } 4.06843 ${height * starPosition + 1.0707} 4.50666 ${
              height * starPosition + 5.6539
            }C4.94593 ${height * starPosition + 1.0612} 5.30202 ${
              height * starPosition + 0.6205
            } 9.01332 ${height * starPosition + 0.0769}C5.30202 ${
              height * starPosition - 0.4665
            } 4.94593 ${height * starPosition - 0.9071} 4.50666 ${
              height * starPosition - 5.5
            }Z`}
            fill="#E7E7E7"
          />
        )}
      </svg>
      <div ref={subMenuRef}>{children}</div>
    </div>
  );
};

export default StarLine;

