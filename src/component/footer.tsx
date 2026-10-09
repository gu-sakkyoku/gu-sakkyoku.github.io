"use client"

import React from 'react';
import styled from "styled-components";


function Cfooter() {
    return (
        <Sfooter>
            <div className="copyright">
                <Sp>Copyright © 2025 Gunma University Sakkyoku Club</Sp>
            </div>
        </Sfooter>
    );
  }

  const Sfooter =styled.footer`
    width: 100%;
    min-height: 3rem;
    background: rgb(95, 95, 95);
    /* 本文のテーマ色を引き継ぐと、明るい表示で灰色の背景に黒文字が重なってしまいます。 */
    color: #fff;
    font-size: 35px;
    font-family: 'Times New Roman', Times, serif;
    padding: 10px 10px;
    text-decoration: none;
    text-align: center;
  `;

  const Sp = styled.p`
    font-size: 12px;
  `;

  export default Cfooter;
