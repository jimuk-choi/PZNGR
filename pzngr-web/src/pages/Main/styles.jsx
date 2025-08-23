import styled from "styled-components";
import { breakpoints } from "../../styles/breakpoints.jsx";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
`;

export const HeaderSection = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100px;
  padding: 0 96px;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.tablet}) {
    height: 100px;
    padding: 0 32px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    height: 80px;
    padding: 0 32px;
  }

  .menu-box {
    display: flex;
    align-items: center;
    gap: 32px;
    font-family: "Pretendard", sans-serif;
    font-weight: 400;
    font-size: 18px;
    color: #000000;

    @media (max-width: ${breakpoints.mobile}) {
      display: none;
    }
  }

  .logo-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    .logo {
      width: 200px;
      height: 56px;
      background-image: url("http://localhost:3845/assets/fa4c5e9b346297a3a1ce243b10a0bb9151eda7fc.png");
      background-size: 108.7% 101.01%;
      background-repeat: no-repeat;
      background-position: center;

      @media (max-width: ${breakpoints.tablet}) {
        width: 160px;
        height: 44px;
      }

      @media (max-width: ${breakpoints.mobile}) {
        width: 100px;
        height: 27.717px;
      }
    }
  }

  .icon-box {
    display: flex;
    align-items: center;
    gap: 32px;

    @media (max-width: ${breakpoints.mobile}) {
      gap: 16px;
    }

    .icon-person,
    .icon-cart {
      width: 40px;
      height: 40px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;

      @media (max-width: ${breakpoints.mobile}) {
        display: none;
      }
    }

    .icon-person {
      background-image: url("http://localhost:3845/assets/4006c40bb46f3209ef0a2ad5d821c324ecf34833.svg");
    }

    .icon-cart {
      background-image: url("http://localhost:3845/assets/ceebafed460942c5fd7eb68226307c77f35079e4.svg");
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
    .menu-hamburger {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;

      &::after {
        content: "";
        width: 28px;
        height: 28px;
        background-image: url("http://localhost:3845/assets/618ff2d3986d9657e9d1b4cabaca57a09ca916e2.svg");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
`;

export const MainImageSection = styled.div`
  width: 100%;
  aspect-ratio: 1920/1783;
  background-image: url(${(props) => props.$bgImage});
  background-position: 0% 58.61%;
  background-repeat: no-repeat;
  background-size: 100% 161.53%;
  flex-shrink: 0;
`;

export const FooterSection = styled.footer`
  background-color: #f4f3f9;
  width: 100%;
  padding: 64px 96px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 64px;
  flex-shrink: 0;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 64px 48px;
    gap: 48px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 48px 32px;
    gap: 24px;
  }

  .footer-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .logo-box {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .logo {
        width: 200px;
        height: 55px;
        background-image: url("http://localhost:3845/assets/fa4c5e9b346297a3a1ce243b10a0bb9151eda7fc.png");
        background-size: 108.7% 101.01%;
        background-repeat: no-repeat;
        background-position: center;

        @media (max-width: ${breakpoints.tablet}) {
          width: 160px;
          height: 44.348px;
        }

        @media (max-width: ${breakpoints.mobile}) {
          width: 100px;
          height: 28px;
        }
      }
    }
  }

  .footer-mid {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    padding-bottom: 48px;
    border-bottom: 0.5px solid rgba(160, 160, 160, 0.6);
    box-sizing: border-box;
    position: relative;
    flex-wrap: wrap;
    gap: 40px;

    @media (max-width: ${breakpoints.tablet}) {
      flex-direction: column;
      gap: 32px;
    }

    @media (max-width: ${breakpoints.mobile}) {
      flex-direction: column;
      gap: 32px;
    }

    .left-box {
      display: flex;
      flex-direction: column;
      gap: 32px;
      flex: 1;

      @media (max-width: ${breakpoints.mobile}) {
        gap: 24px;
        width: 100%;
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 24px;
        font-family: "Pretendard", sans-serif;
        font-weight: 600;
        font-size: 16px;
        color: #000000;

        @media (max-width: ${breakpoints.tablet}) {
          gap: 16px;
        }

        @media (max-width: ${breakpoints.mobile}) {
          gap: 12px;
          font-size: 12px;
        }

        span {
          white-space: nowrap;
        }
      }

      .company-info {
        display: flex;
        flex-direction: column;
        gap: 24px;

        @media (max-width: ${breakpoints.tablet}) {
          gap: 16px;
        }

        @media (max-width: ${breakpoints.mobile}) {
          gap: 8px;
        }

        h3 {
          font-family: "Pretendard", sans-serif;
          font-weight: 600;
          font-size: 18px;
          color: #000000;
          margin: 0;

          @media (max-width: ${breakpoints.mobile}) {
            font-size: 14px;
          }
        }

        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;

          @media (max-width: ${breakpoints.mobile}) {
            gap: 4px;
          }

          .info-row {
            display: flex;
            gap: 16px;
            align-items: flex-start;
            flex-wrap: wrap;

            @media (max-width: ${breakpoints.mobile}) {
              flex-direction: column;
              gap: 16px;
            }

            .info-item {
              display: flex;
              gap: 4px;
              align-items: flex-start;
              font-size: 14px;
              color: #000000;
              flex-wrap: wrap;
              @media (max-width: ${breakpoints.mobile}) {
                font-size: 12px;
                flex: 1;
                min-width: 0;
                flex-wrap: wrap;
              }

              .label {
                font-family: "Pretendard", sans-serif;
                font-weight: 600;
                flex-shrink: 0;
                white-space: nowrap;
              }

              .value {
                font-family: "Pretendard", sans-serif;
                font-weight: 400;

                @media (max-width: ${breakpoints.mobile}) {
                  flex: 1;
                  word-wrap: break-word;
                  white-space: normal;
                }
              }
            }
          }
        }
      }
    }

    .right-box {
      display: flex;
      gap: 64px;
      flex-shrink: 0;

      @media (max-width: ${breakpoints.tablet}) {
        gap: 48px;
      }

      @media (max-width: ${breakpoints.mobile}) {
        flex-direction: column;
        gap: 32px;
        width: 100%;
      }

      .customer-info,
      .payment-info {
        display: flex;
        flex-direction: column;
        gap: 24px;

        @media (max-width: ${breakpoints.tablet}) {
          gap: 16px;
        }

        @media (max-width: ${breakpoints.mobile}) {
          gap: 8px;
        }

        h3 {
          font-family: "Pretendard", sans-serif;
          font-weight: 600;
          font-size: 18px;
          color: #000000;
          margin: 0;

          @media (max-width: ${breakpoints.mobile}) {
            font-size: 14px;
          }
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 12px;

          @media (max-width: ${breakpoints.mobile}) {
            gap: 12px;
          }
        }

        .info-item {
          display: flex;
          gap: 4px;
          align-items: flex-start;
          font-size: 14px;
          color: #000000;

          @media (max-width: ${breakpoints.mobile}) {
            font-size: 12px;
          }

          &.vertical {
            flex-direction: column;
            gap: 4px;
          }

          .label {
            font-family: "Pretendard", sans-serif;
            font-weight: 600;
            flex-shrink: 0;
          }

          .value {
            font-family: "Pretendard", sans-serif;
            font-weight: 400;
          }

          .value-group {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .value {
              font-family: "Pretendard", sans-serif;
              font-weight: 400;
            }
          }
        }
      }
    }
  }

  .footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    @media (max-width: ${breakpoints.mobile}) {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
    }

    .copyright {
      display: flex;
      align-items: center;

      span {
        font-family: "Pretendard", sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #a0a0a0;

        @media (max-width: ${breakpoints.tablet}) {
          font-size: 12px;
        }

        @media (max-width: ${breakpoints.mobile}) {
          font-size: 12px;
        }
      }
    }

    .sns-box {
      display: flex;
      align-items: center;
      gap: 32px;

      @media (max-width: ${breakpoints.mobile}) {
        gap: 16px;
      }

      span {
        font-family: "Pretendard", sans-serif;
        font-weight: 600;
        font-size: 18px;
        color: #000000;

        @media (max-width: ${breakpoints.mobile}) {
          font-size: 16px;
        }
      }

      .sns-icon {
        width: 20px;
        height: 20px;
        background-image: url("http://localhost:3845/assets/ef7c4396a409a7ef04b2e134c2ff9831bd7fbca9.svg");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;

        @media (max-width: ${breakpoints.mobile}) {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
`;
