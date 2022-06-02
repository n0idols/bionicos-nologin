import { useState, useRef, useEffect } from "react";
import MenuItem from "@/components/MenuItem";
import client from "@/lib/apollo-client";
import gql from "graphql-tag";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { NextSeo } from "next-seo";

const arrow = `text-2xl bg-base-200 h-100 hover:cursor-pointer rounded-md m-2 `;

export default function MenuIndex({ categories }) {
  const [current, setCurrent] = useState(0);
  const categoriesHeadingContainerRef = useRef();
  const categoriesRef = useRef([]);
  const categoriesHeadingRef = useRef([]);

  useEffect(() => {
    categoriesHeadingRef.current = categoriesHeadingRef.current.slice(
      0,
      categories.length
    );
    categoriesRef.current = categoriesRef.current.slice(0, categories.length);
  }, [categories]);

  const moveToCategory = (i) => {
    setCurrent(i);
    categoriesRef.current[i].scrollIntoView({
      block: "start",
    });
    window.scrollBy(0, -150);
  };

  const moveHeading = (i) => {
    categoriesHeadingRef.current[i].scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
  };
  const moveHeadingLeft = () => {
    const scrollLeft = categoriesHeadingContainerRef.current.scrollLeft;
    categoriesHeadingContainerRef.current.scrollTo({
      behavior: "smooth",
      left: scrollLeft - 1000,
    });
  };
  const moveHeadingRight = () => {
    const scrollLeft = categoriesHeadingContainerRef.current.scrollLeft;
    categoriesHeadingContainerRef.current.scrollTo({
      behavior: "smooth",
      left: scrollLeft + 1000,
    });
  };
  const getDimensions = (ele) => {
    const { height } = ele.getBoundingClientRect();
    const offsetTop = ele.offsetTop;
    const offsetBottom = offsetTop + height;

    return {
      height,
      offsetTop,
      offsetBottom,
    };
  };
  useEffect(() => {
    const handleScroll = () => {
      const { height: headerHeight } = getDimensions(
        categoriesHeadingContainerRef.current
      );
      const scrollPosition = window.scrollY + headerHeight + 100;

      const selected = categoriesRef.current.findIndex((category) => {
        const ele = category;
        if (ele) {
          const { offsetBottom, offsetTop } = getDimensions(ele);
          return scrollPosition > offsetTop && scrollPosition < offsetBottom;
        }
      });

      if (selected > -1 && selected !== current) {
        moveHeading(selected);
        setCurrent(selected);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [current]);

  const title = `${process.env.NEXT_PUBLIC_SITE_TITLE} - Full Menu`;
  const description = `Browse Bionicos, Natural Juices, Acai Bowls, and much more.`;
  const activeLink = `whitespace-nowrap cursor-pointer p-2 md:p-3 rounded-md bg-gray-200 transition ease-in-out font-bold`;
  const regularLink = `whitespace-nowrap cursor-pointer p-2 md:p-3 rounded-md hover:bg-gray-200 transition ease-in-out`;
  return (
    <>
      <NextSeo title={title} description={description} />

      <div className="w-full flex mx-auto fixed z-50 bg-base-100 xl:justify-center">
        <div className="flex items-center w-full">
          <div>
            <BiChevronLeft onClick={moveHeadingLeft} className={arrow} />
          </div>
          <div
            ref={categoriesHeadingContainerRef}
            className="flex py-1 items-center max-w-6xl mx-auto overflow-x-scroll"
          >
            {categories.map((category, i) => {
              return (
                <a
                  ref={(el) => (categoriesHeadingRef.current[i] = el)}
                  key={i}
                  onClick={() => moveToCategory(i)}
                  className={current === i ? activeLink : regularLink}
                >
                  <h2
                    className={
                      current === category.name ? "font-bold" : "font-thin"
                    }
                  >
                    {category.name}
                  </h2>
                </a>
              );
            })}
          </div>
          <div>
            <BiChevronRight onClick={moveHeadingRight} className={arrow} />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-2 pt-6 md:pt-8">
        {categories.map((category, i) => {
          const { products } = category;

          return (
            <div
              ref={(el) => (categoriesRef.current[i] = el)}
              key={i}
              className="flex flex-col"
            >
              <div id={category.name} className="mt-10 mb-2">
                <h1 className="menu-title">{category.name}</h1>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {products.map((item, i) => {
                  return <MenuItem key={i} item={item} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query {
        categories(sort: "number:asc") {
          name
          products(sort: "number:asc") {
            id
            number
            title
            description
            price
            modifiers(sort: "number:asc") {
              name
              required
              custom
              max
              mod {
                name
                price
              }
            }
            image {
              url
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      categories: data.categories,
    },
  };
}
