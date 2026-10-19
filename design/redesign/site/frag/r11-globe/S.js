/* r11-globe · S — Contact, "Global footprint": the globe (round 11, the founder's note on the round-10 map:
   "a globe effect … with animated lines, like circular animated lines flowing from point to point").
   Built by qa/r11/look/globe/src/gen.mjs (do not edit the built S.js by hand).
   What it draws, and why it is honest: an orthographic globe in hairlines (the outline, a graticule
   every 15°, which is one hour of time) with the land as a dot matrix (Natural Earth, baked as a 0.5°
   mask, about 6 KB). The points are hour marks, not places: each sits where an hour meridian crosses
   the 45th parallel north, on the graticule itself, so no point is a city, an office, a client or a
   person. New York, our address, is the one real place, and the one place named; it stands in for the
   UTC−5 mark on the route. A red line flows west from point to point along the route, through the
   points without stopping, as the working day moves west round the world; the arcs it leaves stay a
   while as hairlines, then fade. Each arc is an arch on the drawing: its true ground path (a great
   circle) bowed off the globe towards the pole by a third of its span, so it reads as an arc anywhere
   on the face and flattens with the foreshortening at the edge instead of flaring past it. The globe
   turns east, as the Earth does. Three lines run the route a third of the world apart, so one is
   always crossing the middle of the face; a line is red only there, and a hairline towards the
   edges, so the view holds one red line at a time. No visitor location is read.
   Motion: on arrival (the plate 40% on screen in a page; at once in a standalone build) the outline
   plots, the graticule comes in, a scan line sweeps the land in west to east, the hour marks and New
   York register; then the line sets off and keeps going, calm and continuous. It pauses off screen,
   in a hidden tab, and on "Pause". Reduced motion: one still frame, the line drawn, nothing moves.
   Canvas 2D, no library, devicePixelRatio up to 3; the one label is HTML moved by transform only. */
(function () {
  var MASK = {"step":0.5,"cols":720,"rows":360,"alphabet":"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_","mask":"7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q0Zd2azDohwy2Sy5wyWFEk2iyxwyIxRIJ2Dy0vHxQBU2BypJEpFxlx8EBExTLykynSJaFxixISoFxWOyiyoSBdNxew7FDGENyFOygyVCWPCSSxgw8SyUMDDyayIDMIEEFMCWLxmw-RyhJyWybFDGIDGWGxrxANEEyaIyYyFHbFMDCPNxoxEHGG04x4Hw5RUxlxCHypHyVx1KOBYLEXPxjyuFxBMySxzHGFHELKIFUCWxhyjOw8eyGx-LEHHKJHMDtxQycMw4rvNxIx9XKGDFDZrxOyYKw2wyvQCGw-yFGdEFXtxLyYIw1wyw2DRDw8xuKx-xIyYHw4uyNxwQfBJKIBLBwwxHyUIwww_w4DxLxvQCBREGIDJFFDHCHrxAyaHvxNIKbExJxuNCGBEDCDFGDBHCGGIBKwzxByWHaHECKxhWExMxtMCUBGHKCDITCIpw9yaGbIEBEFCxgVTw-xtKDVBGKHCDIglxCyUIZIEDBxqGBOVw8AFpCxBFJYQHGllw3BGyWHVKDFBxqEow3CpKBExEdOJFnfDCw2CExcMwwHSMDyqqkcoCbXLKJmbw4xjPxJMCysoirTLDBDDJgEEDGOEEBHUaGBw3xVYBCw4CLLCysVNHhwyFiGBBZGHDIKIKTgw0xWhw0JGJDy9ERCABaxnDIGBXIBDGJKPiwxxYpgCIBELFIEy9BUAFWxoMHNFDNEIQOcvxavKEKFDaBKCzTAHYxlEFDMDZDKJEERWpxfw0HGEwwEzSAKWylJDGRUpxfw2GDFwxDzUAKBGSygSXRnxfw3HDCwyEzUATJFDyYYMDJRkYDKFw3qGGDEBw4BzXCRFyjZMFFUecTw1VEVL0XABHHLygCEMVGCWZkQwzUITK0YKFMKByTDHIZcXiSwzVGVDEE0WBmySDKHBIRaXlNwzWFYD0aEmyNHGDFQObVoHw1WF04DTEMyQKBaICFbTxjWF07CeySRDXHDBdQxiXG09BdyRSCGBDFCCKEhPxgYI0bDYHcyRbBDMtOxfZI0TBGDVLdyPgNtMxgYJ0OGFDTOdbBHDxohRvGxgZI0MJBFRRaDCYCHGxliQwxDxhbIGGz9NNDCTkSCFRxdiQIDyLaUz7OFCBekQFBXxahRHFyKJBPLzyFEFHKGikCDEBHexbdUFGyJHEMNzskGjtHixYfexyEUDHKQzpjHktEDDlxTfexwEfKQzniLjrEEDnxSDBcexvIXCDJKDCzmjNipEwxxYZexvHVFEIJzrjOinEw1xZVfxwFWGDHKzpkPikGw2xcShxuHUECDBDNzolNkiDw8xgLlxtHUDDCSzlnMlfDxBxgGsxjEDHTDOCEzmpNkxjxgGtxgGGFSFCCFzzlKnxeCFxeHsxfHGGR0IEBaIoxeCGxeGuxdHDJK0QBDaIoxfBGxeHuxcGEMG0WZFrxoxdFvxcFFMF0WbErxoxeEtxeCHMG0SBDbDsxpyLCDxnLD0TDDaBuxqyHEDxmIF0WDDxJxox8FHFCxmCBBK0WDExIxqEBxzFDKFxv0ZDExIxsDCxvKCHKxn0dDCBCxHxtECxrDHKLxjDC0bECxKxvBDxqCHMMxh0hEBxLxvDBxpBJLNxj0eFBxLxwxrBKTBCCxl0bGCxKxwx4UCxmxOCzJHDxJxwx3CDCBx2xAEFGzIIBxLxwyAx2w-HDFzIxVxwx0DHx3cCgGzRKBxLxwxyDFx7cFcJDFzGKDxKxwxvFDx-UBHFbUzDLEDBxFxwxsICx_TFFFaWzAMIxFxvxsx7aDCIGHWYy4BEMKxFxvxrx8YMBCHIUby0RIxIxvxrx8YLCEGJSbyzSDCCxJxwxsx6YLCFIHRJHLyxUCxOxwxnx_WWHGTFLIyxWCxNxvxnyATPDJHEJEDDy4CPVDxNxvxlyCSRDKDDBCGBDFy6ENXExMxwxkyCSRCMCHGHy6EECGZExMxwxhBByCTRCNCHGGy5FCGEZExMxxxhyDTgBIFHy2PGXExNxyxdBCyERgCJGFy3OHWDxOxzxcBByFRaGMDBBGy4DBKGTFxOxzxcyHPVCHEMDJy4BFIGOBCGxOx0xcyLJKEBLWCJOBytJHOJxOx0xcyMCLUmCEDEyqLGNJxPx1xbyMCIYwyyoNGNJxPx2xayMGCaZGNCEynOFHQxPx3xYyMisCFynODIOxSx5xUyNiwzyqVECBBExWx7xQyOlwxyqUBDECBxYx9xNyNnwwyrSFBCxdx-xKyOtPCaysRFxgx-xJyOwyJGYytSCxhx-EBxDyPwyJKTyvRCxhx_DDxAyPw1HPFEFyvRBxiyADDw_yQw3EzLx1yADDvHJyQ0Gx1yBCEmBHIBDFyPxzFyPx0yCCDjICOEyOxZBaFyPx0yDCDhZFyLxXBDBbFyOx0yECDecEyKxZBeGyMx1yCFEbcFyHxdEbGyKx2yDEEaeFyFxeEcHyHx3yFEDZeFCCyBxfEcHEDx-x4yHCEYfEFBx9xhFbMBBx-x4yIBEZfDyDxiEbCBJBCx8x5yICFWhByDxjFbBBHDIIExpx6yIDFVmCx9xkEdGEVxoECx0yJDFUnBx8xmEdEGVxlFCx1yLCFTnBx7xnGnUxjFDx1yMBGRykxnGpUxfHDx1yUQcJx-xpGpUqCwwKBx2yVPbCDIx7xqFqTqDrOBx2yVQjFx5xsEpUnGpyHyVQQFREx3xsEoWiKfFByLvBxlRNHSFx1xsFmdcLdFCyLyVRNGUHxzxrGkebMcyTwwCxjSMGcDBCxsxrHifZQZGEyKwwCxkSKHdIxpxsHieYRYGEyLyYRHJeIxpxrHggXTYFEyLyZSBMTEEHBBCBDDxjxsHehWVXdExzyccVBx6xtHbjVWYcDx0yeZyQxvHakSYZbExzygXyQxvHWoRZFBUaExzyjUyQxvITqQZEDVZDx0ymCFKBIyHxwGTrOdBEWXDx1yuTyFxyGRtMjXWDx1yvSyEx1ENwyLkWXCx1ywSyEx1DMwzLkWXDBBxyy0NyFx2DIw2LkXXGxwy2CBIyFx3BFw7LkDCRWCDCxwy5IyFx4BDw8KlDCRXBEBxwy6HXBxux4w_KlDFNYBGCxty7GWCCCxqx3PBwxJlDGMgBxty8EUEDExqx2JGwyIlCHLbCDCxty9EQPNBxcx2EKwyIlCIJWBFBBCxwy8FQHBMCEBCxdyDwyHmCKFYBHCxwy9BBEOHCTxfyBw0FnBMDYBHCxxzAEEEEICUxfyAw0FCCjBMCYBOBxszBICCCgxfx_w0DECiEKBmExrzDEFlxdx-w3BDEhFtHxrzFDDnxcx-w8DjDrJxrzGBFnxcx8w9DkCrBDFxrzNnxdx6w9DlDeCNDBBxrzNoxdbExZw-DlEdCNDxtzNvxYVJxYxnEbFNBxtzNwyxWSLxXxeEFGYIx6zNwzxWFYxVxfFFGWIx7zNw0x5xOxgFEGVIx8zOw0x5xMxiFEFUIx9zNw1x5xLxkFEETJx9zMw2x5xKxmFDEQMx9zLw4x4xJxoFDEPNx8zLw5x3xHxrHCCLBCOTBxozKw6x3xGxtHCBKTMBFCxnzIw8x3xExvIMSEJGCxnzIw7x4xDxwJLRFBOBxozHxAxzxDxyILREBPBxozHxABCxwxCx0HMQECECJBGFxczGxHxtxCx1IKPFGRGxczGxJxrxBx2ILNGFUEHCxTzGxJxsw_x4IKNFGXCEGxRzIxMxow8x7JINFDBCUFDLSCw5zIxRxkw7x8IMCBGFDBDHCCFEUSBw4zHxUxjw6x9HRDHCBDIBHBEBBUxIzGxWxjw4x-HbCCDYUNDw2zFxYxiw3yBFbCCBBBbSMCw3zGxbxfw2yCEbCEBdRKCw4zGxcxew2yDDxAREGGBwyzGxcxew2yGEw0BISECJBwxzHxbxfw2yEGEDsBIRRBBBuzJxZxgw1yGNwzRUBtzJxZxgw0yKBCKvNBFWBqzKxYxgw0yRIOBdDCHFEXBozKxYxgw1ybECEGEbGGEYBmzLxWxhw1ypDiBIFXBlzLxWxhw2yfCGDtFUCmzMxUxjw1ynBwxEw7zMxSxlw2zyCjzNxRxlw2y3BTCxKzNxQxmw2y4CRCxKzOxOxnw2RByjBBKKCxKzOxOxmw3RByiNKDxJzPxMxmw4QDyhMKExJzPxLxnw4QDygMLExJzQxKxmw5PEyXFDNLFxIzQxKxmw6NFyWGDMMHrBazRxJxmw5NHyUXLIqBazTxHxmw5MGBByUZJIxFzVxFxlw5JLyTBBaIIrBYBzXxDxlw4KLyRBBdGJxCCBzZxBxlw1MLyShEKxEzZxBxmwyOLySvw_CDzbw-xnwxPLyRwwxEzbw-xovQKyRwyxDzcw9xouSJyRwzxCzcw8xqsTJyPw3xAzcw7xrrUIyNw7fBfzcw7xsrSJyIxBfCdzcw6xtrRKyGxEfCczcw6xurQJyGxFgCbzcw5xwqQJyFxGiBazbw5xxqQJyExKw6zbw1x1qQIyFxKw6zbwyx4qQIyExLw6zbwwx6qQIyExNw4zbux8oTGyFxOw3zbtx9mWDyIxOw2zbsx_jyjxOw2zatx_kyhxPw2zatx_kyhxPw2zatyAiyjxOw2zatyAiyjxPw1zatyBhykxOw1zZtyDfylxOw1zZsyEeynxNw1zZryGcyoxMw2zZryHaypxMw2zZqyIaypxMw2zZpyKYyrxLw2zZoyLXysbGqw2zZmyNWyuUBBNmw3zZmyNUyvTSkw4zZlyOTywRVGBbw5zYlyPQyySWECbw5zYbBJyQGy7JfDCbw6zYcDEyUBzAFiBDBBZsBNzXe2IYtDLzXe2JXuCLzWg2JVwwBLzWg2KUwxBKzVh2KUwxDIzVg2MSwyEDBDzVf2PGBFw2IDzVc2bBw4HEzWW3YGGzVX3ZFGzVW3bEGzUX2eBw3BEDHzUS2kHvCBBBDIzUS2kHuFMzUBBRBB2iFvFMzUBBS2jFuFNzUBBQ2mDtGOzWQ3VHOzTBCP3THRzTS3SHSzTP3UISzTO3UITzSP3VGUzSQ3uzTS3rzSS3szRT3szRR3uzRQ0QEzbzRQ0QCzdzRO3xzSM3yzSMUB3dzSMQG3czSNPB3hzUHBD3xzUBBEBF3wzVCBCBF3wzXL3uzZN3qzcG3u7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7QzxE3bztDBB3ezpD3kzoD3lzmF1KCw_CxYzkHzlKxZHNGoDxYziGzmNw8CYLIOKNBPxXzhFzjUwwBDWCuBw0xEzhEzfeFFeyDxDzhEzbwyVyJxAzgHzEDNw4SySFCwyzZECLzAJFw7RydvzZECMy7PBw9LyppzZFBMyLGFFBMPxOLyvmzYHBMyFMCxzIy3fzULCMxsEGEDyHHzDVycBw1NDLxlyeHzHSycLsDCFFMxiyjBzKSyZBbBqOxf1wTyZLJDEJKBRWxa1zUxtCEHgqBKEbxZ1yXx6MYxPxc1taxVw3TxKxe1sdxLxTBxIxd1tfxDyfxd1xgxEyYxc13hxAyOxg2BhrDCFGyWxa2FgsyoxS2Kgtyhw4JS2SdhHIycw4NP2WajGPyUw3OP2LlxByOfBSQc19mxDyOcELTg16nxByZMKNLg2AowwKCyjw-2Nmwzy3aHI2Zkw2y5O2xiw2y8F28dw16EXw26FVCBECEKl6GEDHAes6GAoGKO6KA7QA7QA7QA7QA7QA7QA7QA7QA7Q"};
  var ROUTE = [[40.71,-74.01],[45,-105],[45,-150],[45,180],[45,150],[45,105],[45,75],[45,30],[45,0],[45,-45]], HOURS = [2,3,2,2,3,2,3,2,3,2], NYI = 0;
  /* ── the geometry (pure: the generator runs this same code to bake the no-script still) ── */
  var RAD = Math.PI / 180;
  /* the land: the 0.5° mask's run lengths → one byte a cell (1 = land) */
  function decodeMask(M) {
    var A = M.alphabet, s = M.mask, out = new Uint8Array(M.cols * M.rows), i = 0, p = 0;
    for (var r = 0; r < M.rows; r++) {
      var c = 0, v = 0;
      while (c < M.cols) {
        var ch = A.indexOf(s.charAt(i++)), n = ch < 48 ? ch : (ch - 48) * 64 + A.indexOf(s.charAt(i++));
        if (v) out.fill(1, p + c, p + c + n);
        c += n; v ^= 1;
      }
      p += M.cols;
    }
    return out;
  }
  function onLand(cells, M, lat, lon) {
    var r = Math.min(M.rows - 1, Math.max(0, Math.floor((90 - lat) / M.step)));
    var c = Math.floor((((lon + 180) % 360) + 360) % 360 / M.step) % M.cols;
    return cells[r * M.cols + c] === 1;
  }
  /* the dot matrix: rows `step` degrees apart, dots `step` apart along each row (so they keep an even
     pitch on the sphere instead of bunching at the poles), every other row shifted half a pitch.
     Each land dot is stored as its unit vector on the sphere (x towards 0°/0°, y towards 0°/90°E, z north). */
  function lattice(cells, M, step) {
    var pts = [];
    for (var k = 0, lat = 90 - step / 2; lat > -90; lat -= step, k++) {
      var n = Math.max(1, Math.round(360 * Math.cos(lat * RAD) / step));
      for (var j = 0; j < n; j++) {
        var lon = -180 + (j + (k % 2 ? 0.5 : 0) + 0.25) * 360 / n;
        if (!onLand(cells, M, lat, lon)) continue;
        var cp = Math.cos(lat * RAD);
        pts.push(cp * Math.cos(lon * RAD), cp * Math.sin(lon * RAD), Math.sin(lat * RAD));
      }
    }
    return new Float32Array(pts);
  }
  function vec(lat, lon) { var cp = Math.cos(lat * RAD); return [cp * Math.cos(lon * RAD), cp * Math.sin(lon * RAD), Math.sin(lat * RAD)]; }
  /* the view: orthographic, centred on (lat0, lon0); returns x right, y up, z towards the reader */
  function view(lat0, lon0) {
    var a = lon0 * RAD, b = lat0 * RAD;
    return { ca: Math.cos(a), sa: Math.sin(a), cb: Math.cos(b), sb: Math.sin(b) };
  }
  function toView(V, x, y, z, out) {
    var c = x * V.ca + y * V.sa;
    out[0] = y * V.ca - x * V.sa;
    out[1] = V.cb * z - V.sb * c;
    out[2] = V.sb * z + V.cb * c;
    return out;
  }
  /* a great circle from a to b (unit vectors), the point at t (0…1); h lifts it off the ground by up
     to that share of the radius (the drawing passes 0: its arches bow in the picture plane, below) */
  function arcPoint(a, b, w, h, t, out) {
    var s = Math.sin(w), k1 = s > 1e-6 ? Math.sin((1 - t) * w) / s : 1 - t, k2 = s > 1e-6 ? Math.sin(t * w) / s : t;
    var lift = 1 + h * Math.sin(Math.PI * t);
    out[0] = (k1 * a[0] + k2 * b[0]) * lift;
    out[1] = (k1 * a[1] + k2 * b[1]) * lift;
    out[2] = (k1 * a[2] + k2 * b[2]) * lift;
    return out;
  }
  function angle(a, b) { return Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))); }
  /* an arch from a to b as the drawing shows it: the ground path (the great circle) seen from V, bowed
     off it in the picture plane, towards the pole, by k times its span on the picture (most at the
     middle). Near the outline the span foreshortens, so the arch flattens with it and never flares out.
     bowSetup fills o once a frame; bowPoint writes [x, y, z of the ground point] for t (0…1). */
  var bA = [0, 0, 0], bB = [0, 0, 0], bG = [0, 0, 0];
  function bowSetup(V, a, b, k, o) {
    toView(V, a[0], a[1], a[2], bA); toView(V, b[0], b[1], b[2], bB);
    var dx = bB[0] - bA[0], dy = bB[1] - bA[1], L = Math.hypot(dx, dy) || 1e-9, nx = -dy / L, ny = dx / L;
    if (nx * (0 - (bA[0] + bB[0]) / 2) + ny * (V.cb - (bA[1] + bB[1]) / 2) < 0) { nx = -nx; ny = -ny; }
    o.nx = nx; o.ny = ny; o.b = k * L; return o;
  }
  function bowPoint(V, a, b, w, o, t, out) {
    arcPoint(a, b, w, 0, t, bG); toView(V, bG[0], bG[1], bG[2], out);
    var s = o.b * Math.sin(Math.PI * t); out[0] += o.nx * s; out[1] += o.ny * s;
    return out;
  }
  var P = "km-r11-globe-S";
  var TILT = 16;           /* the view's latitude: the north tipped towards the reader */
  var TURN = 0.004;        /* the globe turns east 4° a second (one turn in 90 s), in degrees a ms */
  var HOUR = 1100;         /* the line covers one hour (15°) of the route in this many ms */
  var START = 3000;        /* the line sets off this long after the pass starts (ms) */
  var A0 = 17;             /* the first line sets off this many hours along the route (the 30°E mark) */
  /* three lines run the route a third of the world apart (8 hours), so one is always crossing the
     middle of the face; the third waits 4 s, until it is round the back, so only one sets off in view */
  var LINES = [{ off: 0, wait: 0 }, { off: -8, wait: 0 }, { off: -16, wait: 4000 }];
  var RED_IN = 54, RED_OUT = 68;   /* a line is red within 54° of the face's middle, a hairline beyond 68°: the lines
                                      are 120° apart, so the red hands over in a short crossfade at about ±60° */
  var VIEW0 = -29;         /* the view's centre longitude as the line sets off: New York 45° west of it */
  var EASE = 0.55;         /* at each point the line slows to 45% of its pace, and is 155% mid-arc */
  var TAIL = 1;            /* the red's length, in hours of the route */
  var BOW = 0.32;          /* each arch rises a third of its span: it reads as an arc anywhere on the face */
  var HOLD = 3600, FADE = 1400;   /* a finished arc stays as a hairline this long (ms), then fades */
  var LIT = 1500;          /* a point the line passes through stays filled this long (ms) */
  var STILL = { lon: -40, hairs: [7, 8], red: 9 };   /* the still: 30°E → 0° → 45°W, then red into New York */
  var PITCH = 7;           /* the dot matrix: px between dots at the globe's centre */

  /* ── the route: hop k runs from ROUTE[k] west to ROUTE[k + 1], HOURS[k] hours long ── */
  var N = ROUTE.length, ON = [], HOP = [], C = [0];
  for (var i = 0; i < N; i++) ON.push(vec(ROUTE[i][0], ROUTE[i][1]));
  for (i = 0; i < N; i++) {
    var a = ON[i], b = ON[(i + 1) % N], w = angle(a, b);
    HOP.push({ a: a, b: b, w: w, n: Math.max(28, Math.round(w * 70)), o: {} });
    C.push(C[i] + HOURS[i]);
  }
  var DAY = C[N];          /* 24 */
  /* where the line is at s hours along the route: the hop, and how far along it (eased) */
  function at(s, out) {
    var lap = Math.floor(s / DAY), r = s - lap * DAY, k = 0;
    while (k + 1 < N && C[k + 1] <= r) k++;
    var u = (r - C[k]) / HOURS[k];
    out.k = k; out.lap = lap; out.u = u - EASE / (2 * Math.PI) * Math.sin(2 * Math.PI * u);
    out.s0 = lap * DAY + C[k]; out.s1 = out.s0 + HOURS[k];
    return out;
  }
  function easeIO(t) { return t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOut(t) { return t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3); }
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }

  /* ── the graticule: meridians and parallels every 15° (one hour of time apart), as unit vectors ── */
  var GRAT = [];
  (function () {
    for (var lon = -180; lon < 180; lon += 15) { var m = []; for (var la = -75; la <= 75; la += 3) m.push(vec(la, lon)); GRAT.push({ p: m, mer: true, eq: false }); }
    for (var lat = -75; lat <= 75; lat += 15) { var q = []; for (var lo = -180; lo <= 180; lo += 3) q.push(vec(lat, lo)); GRAT.push({ p: q, mer: false, eq: lat === 0 }); }
  })();

  window.KM = {
    init: function (root, opts) {
      var reduced = !!(opts && opts.reduced);
      var stitched = document.documentElement.classList.contains("km-home");
      var q = function (s) { return root.querySelector("." + P + "__" + s); };
      var box = q("globe"), cv = q("cv"), cvs = q("cvs"), nyL = q("ny"), btn = q("pause");
      if (!box || !cv || !cvs || !cv.getContext) return function () {};
      var ctx = cv.getContext("2d"), ctxs = cvs.getContext("2d");
      var still0 = null;   /* what the fixed layer shows: the outline's progress and the graticule's alpha */
      var cells = decodeMask(MASK);
      var COL = {}, dots = null, pitchDeg = 0, S = { w: 0, dpr: 1, R: 0, cx: 0, cy: 0 };
      var te = 0, last = 0, raf = 0, started = false, inView = !stitched, paused = false, io = null, ro = null, mo = null;
      var nyBox = { w: 0, h: 0 };
      var tmp2 = [0, 0, 0], g0 = [0, 0, 0], A = {};

      root.classList.add("is-live");
      function colours() {
        var cs = getComputedStyle(root);
        ["fg", "fg-2", "fg-3", "line", "line-2", "signal", "panel"].forEach(function (k) { COL[k] = cs.getPropertyValue("--" + k).trim() || "#888"; });
        still0 = null;
      }
      colours();
      function size() {
        var w = box.clientWidth;
        if (!w) return false;
        var dpr = Math.min(3, window.devicePixelRatio || 1);
        if (w === S.w && dpr === S.dpr) return true;
        S.w = w; S.dpr = dpr; S.R = Math.round(w * 0.42); S.cx = w / 2; S.cy = w / 2;
        cv.width = cvs.width = Math.round(w * dpr); cv.height = cvs.height = Math.round(w * dpr); still0 = null;
        var pd = PITCH / S.R / RAD;
        if (!dots || Math.abs(pd - pitchDeg) / pitchDeg > 0.08) { pitchDeg = pd; dots = lattice(cells, MASK, pd); }
        nyBox.w = nyL ? nyL.offsetWidth : 0; nyBox.h = nyL ? nyL.offsetHeight : 0;
        return true;
      }

      /* ── drawing ── */
      function lonAt(t) { return reduced ? STILL.lon : VIEW0 - TURN * (t - START); }
      function sx(p) { return S.cx + S.R * p[0]; }
      function sy(p) { return S.cy - S.R * p[1]; }
      var gA = [0, 0, 0], gB = [0, 0, 0], gC = [0, 0, 0];
      /* the graticule: family "m" (meridians, which move as the globe turns) or "p" (parallels and the
         equator, which a turn about the axis leaves where they are) */
      function grat(c, V, alpha, fam) {
        /* true hairlines: one device pixel. On a dense screen that is a fraction of a CSS pixel, so it
           takes the next token up (--line-2 over one device pixel carries about the ink of --line over two) */
        var hair = S.dpr >= 1.5;
        c.lineWidth = hair ? 1 / S.dpr : 1;
        for (var pass = 0; pass < 2; pass++) {
          if (fam === "m" && pass) break;
          c.beginPath();
          for (var g = 0; g < GRAT.length; g++) {
            var L = GRAT[g]; if (L.mer !== (fam === "m") || L.eq !== (pass === 1)) continue;
            var prev = gA, cur = gB, has = false;
            for (var n = 0; n < L.p.length; n++) {
              var v = L.p[n]; toView(V, v[0], v[1], v[2], cur);
              if (has) {
                if (prev[2] >= 0 && cur[2] >= 0) c.lineTo(sx(cur), sy(cur));
                else if (prev[2] >= 0 || cur[2] >= 0) {   /* crosses the outline: end the line on it */
                  var f = prev[2] / (prev[2] - cur[2]);
                  gC[0] = prev[0] + (cur[0] - prev[0]) * f; gC[1] = prev[1] + (cur[1] - prev[1]) * f;
                  var l = Math.hypot(gC[0], gC[1]) || 1; gC[0] /= l; gC[1] /= l;
                  if (prev[2] >= 0) c.lineTo(sx(gC), sy(gC)); else { c.moveTo(sx(gC), sy(gC)); c.lineTo(sx(cur), sy(cur)); }
                }
              } else if (cur[2] >= 0) c.moveTo(sx(cur), sy(cur));
              has = true;
              var sw = prev; prev = cur; cur = sw;
            }
          }
          c.globalAlpha = alpha; c.strokeStyle = pass || hair ? COL["line-2"] : COL.line; c.stroke();
        }
        c.globalAlpha = 1;
      }
      var V0 = view(TILT, 0);
      function fixedLayer(lp, ga) {
        if (still0 && still0[0] === lp && still0[1] === ga) return;
        still0 = [lp, ga];
        ctxs.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
        ctxs.clearRect(0, 0, S.w, S.w);
        if (lp > 0) {
          ctxs.beginPath(); ctxs.arc(S.cx, S.cy, S.R, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * lp);
          ctxs.strokeStyle = COL["line-2"]; ctxs.lineWidth = 1; ctxs.stroke();
        }
        if (ga > 0) grat(ctxs, V0, ga, "p");
      }
      /* the land: one small square a dot (fillRect: axis-aligned squares are the cheapest thing a canvas
         rasterizes), smaller towards the outline */
      function land(V, scan) {
        var R = S.R, cx = S.cx, cy = S.cy, ds = 2;
        ctx.fillStyle = COL["fg-3"];
        for (var n = 0; n < dots.length; n += 3) {
          var x = dots[n], y = dots[n + 1], z = dots[n + 2], c = x * V.ca + y * V.sa;
          var vz = V.sb * z + V.cb * c; if (vz <= 0.1) continue;
          var px = cx + R * (y * V.ca - x * V.sa); if (px > scan) continue;
          var py = cy - R * (V.cb * z - V.sb * c), s = ds * (0.4 + 0.6 * Math.sqrt(vz));
          ctx.fillRect(px - s / 2, py - s / 2, s, s);
        }
      }
      /* one hop's arch from u0 to u1 (0…1, already eased); where its ground path goes round the back
         of the globe, it is left out */
      function arc(V, H, u0, u1) {
        if (u1 <= u0) return;
        var n = Math.max(2, Math.ceil(H.n * (u1 - u0))), open = false;
        bowSetup(V, H.a, H.b, BOW, H.o);
        for (var m = 0; m <= n; m++) {
          var t = u0 + (u1 - u0) * m / n;
          bowPoint(V, H.a, H.b, H.w, H.o, t, tmp2);
          if (tmp2[2] >= 0) { if (open) ctx.lineTo(sx(tmp2), sy(tmp2)); else { ctx.moveTo(sx(tmp2), sy(tmp2)); open = true; } }
          else open = false;
        }
      }
      /* how far round to the front a point of the route is (its ground point's depth, 1 = facing us);
         lines and points fade as they near the outline, so they leave and arrive softly */
      function depth(V, H, u) { arcPoint(H.a, H.b, H.w, 0, u, g0); toView(V, g0[0], g0[1], g0[2], g0); return g0[2]; }
      function limb(z) { return clamp01((z - 0.02) / 0.2); }
      function node(V, i, fill, alpha) {
        toView(V, ON[i][0], ON[i][1], ON[i][2], tmp2); if (tmp2[2] < 0.05 || alpha <= 0) return;
        var x = Math.round(sx(tmp2)) + 0.5, y = Math.round(sy(tmp2)) + 0.5, a = alpha * limb(tmp2[2]);
        ctx.globalAlpha = a; ctx.fillStyle = COL.panel; ctx.fillRect(x - 2.5, y - 2.5, 5, 5);
        if (fill > 0) { ctx.globalAlpha = a * fill; ctx.fillStyle = COL.fg; ctx.fillRect(x - 2.5, y - 2.5, 5, 5); }
        ctx.globalAlpha = a; ctx.strokeStyle = COL["fg-2"]; ctx.lineWidth = 1; ctx.strokeRect(x - 2.5, y - 2.5, 5, 5);
        ctx.globalAlpha = 1;
      }
      function newYork(V, a1, a2) {
        var p = ON[NYI]; toView(V, p[0], p[1], p[2], tmp2); if (tmp2[2] < 0.02) return null;
        var x = Math.round(sx(tmp2)), y = Math.round(sy(tmp2)), z = tmp2[2], f = limb(z + 0.05);
        if (a1 > 0) {   /* the crosshair */
          ctx.globalAlpha = a1 * f; ctx.strokeStyle = COL["fg-2"]; ctx.lineWidth = 1; ctx.beginPath();
          ctx.moveTo(x - 12, y + 0.5); ctx.lineTo(x - 7, y + 0.5); ctx.moveTo(x + 7, y + 0.5); ctx.lineTo(x + 12, y + 0.5);
          ctx.moveTo(x + 0.5, y - 12); ctx.lineTo(x + 0.5, y - 7); ctx.moveTo(x + 0.5, y + 7); ctx.lineTo(x + 0.5, y + 12);
          ctx.stroke();
        }
        if (a2 > 0) { ctx.globalAlpha = a2 * f; ctx.fillStyle = COL.fg; ctx.fillRect(x - 4, y - 4 - 6 * (1 - a2), 8, 8); }
        ctx.globalAlpha = 1;
        return { x: x, y: y, z: z };
      }
      /* New York's label: HTML, moved by transform only (no layout). It sits below New York, to the
         south-east (or south-west near the right edge): every hour mark and every arc is to its north. */
      function placeNy(pos, a) {
        if (!nyL) return;
        if (!pos || a <= 0) { nyL.style.opacity = "0"; return; }
        var left = pos.x + 12, flip = left + nyBox.w > S.w - 2;
        if (flip) left = pos.x - 12 - nyBox.w;
        nyL.classList.toggle("is-west", flip);
        nyL.style.transform = "translate3d(" + Math.round(left) + "px," + Math.round(pos.y + 9) + "px,0)";
        nyL.style.opacity = String(a);
      }

      /* one line on the route: its head s hours along, having set off at s0 (hours). The arcs it has
         finished stay as hairlines, then fade; the current arc is a hairline up to the head (the red,
         where it shows, is drawn over it). Returns where the head is (the hop, and the hour it started). */
      function ez(u) { return u - EASE / (2 * Math.PI) * Math.sin(2 * Math.PI * u); }
      function line(V, s, s0) {
        var cur = at(s, A), hs = cur.s0;
        ctx.lineWidth = 1; ctx.strokeStyle = COL["fg-2"];
        for (var j = 0; j <= 3; j++) {
          var k = ((cur.k - j) % N + N) % N;
          if (j) hs -= HOURS[k];
          var he = hs + HOURS[k];
          if (hs < s0 - 1e-6) break;               /* before this line set off */
          var hi = Math.min(he, s);
          if (hi <= hs) continue;
          var fa = 1;
          if (j) { var age = (s - he) * HOUR; fa = age < HOLD ? 1 : 1 - (age - HOLD) / FADE; }
          if (fa <= 0) break;
          var H = HOP[k], uHi = hi >= he ? 1 : ez((hi - hs) / HOURS[k]);
          ctx.globalAlpha = fa * limb(depth(V, H, 0.5 * uHi)); ctx.beginPath(); arc(V, H, 0, uHi); ctx.stroke();
        }
        ctx.globalAlpha = 1;
        return cur;
      }
      /* the red: from TAIL behind the head to the head, through the point it has just passed; only
         while the head crosses the middle of the face (so one line at a time is red) */
      function red(V, s, s0, lon) {
        var hd = at(s, A), tail = Math.max(s0, s - TAIL);
        arcPoint(HOP[hd.k].a, HOP[hd.k].b, HOP[hd.k].w, 0, hd.u, g0);
        var d = Math.abs(((Math.atan2(g0[1], g0[0]) / RAD - lon) % 360 + 540) % 360 - 180);
        var z = clamp01((RED_OUT - d) / (RED_OUT - RED_IN));
        if (z <= 0) return;
        ctx.globalAlpha = z; ctx.strokeStyle = COL.signal; ctx.lineWidth = 1.5; ctx.lineCap = "butt"; ctx.beginPath();
        if (tail < hd.s0) {
          var kp = (hd.k - 1 + N) % N;
          arc(V, HOP[kp], ez((tail - (hd.s0 - HOURS[kp])) / HOURS[kp]), 1); arc(V, HOP[hd.k], 0, hd.u);
        } else arc(V, HOP[hd.k], ez((tail - hd.s0) / HOURS[hd.k]), hd.u);
        ctx.stroke(); ctx.globalAlpha = 1;
      }

      function frame(t) {
        if (!size()) return;
        var R = S.R, cx = S.cx, cy = S.cy;
        ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
        ctx.clearRect(0, 0, S.w, S.w);
        var V = view(TILT, lonAt(t));
        var still = reduced, e = still ? 1e9 : t;
        /* 1 · the outline plots (0–700ms), the graticule comes in (300–900); the fixed parts are drawn
           once on the lower canvas, the meridians (which turn) here */
        var lp = still ? 1 : easeIO(e / 700), ga = still ? 1 : clamp01((e - 300) / 600);
        fixedLayer(lp, ga);
        if (ga > 0) grat(ctx, V, ga, "m");
        /* 2 · a scan line sweeps the land in, west to east (700–2300) */
        var sp = still ? 1 : easeIO((e - 700) / 1600), scan = cx - R - 3 + (2 * R + 6) * sp;
        if (sp > 0) land(V, scan);
        if (sp > 0 && sp < 1) {
          var dx = scan - cx, hh = Math.sqrt(Math.max(0, R * R - dx * dx));
          ctx.strokeStyle = COL["fg-2"]; ctx.lineWidth = 1; ctx.beginPath();
          ctx.moveTo(Math.round(scan) + 0.5, cy - hh); ctx.lineTo(Math.round(scan) + 0.5, cy + hh); ctx.stroke();
        }
        /* 3 · the lines: hairlines first, then the points, then the red on top */
        var heads = [], fills = new Float32Array(N);
        if (still) {
          ctx.lineWidth = 1; ctx.strokeStyle = COL["fg-2"]; ctx.beginPath();
          STILL.hairs.forEach(function (k) { arc(V, HOP[k], 0, 1); }); ctx.stroke();
        } else if (e >= START) {
          var run = (e - START) / HOUR;
          LINES.forEach(function (L) {
            var s = A0 + L.off + run, s0 = A0 + L.off + L.wait / HOUR;
            if (s < s0) return;
            var cur = line(V, s, s0);
            heads.push([s, s0]);
            /* the point it last passed through fills, then empties */
            if (cur.s0 >= s0) { var ago = (s - cur.s0) * HOUR; if (ago < LIT) fills[cur.k] = Math.max(fills[cur.k], 1 - easeOut(ago / LIT)); }
          });
        }
        /* the hour marks (2300–2700) and New York (2500–3000) register */
        var na = still ? 1 : clamp01((e - 2300) / 400);
        for (var i = 0; i < N; i++) if (i !== NYI) node(V, i, fills[i], na);
        if (still) {
          ctx.strokeStyle = COL.signal; ctx.lineWidth = 1.5; ctx.lineCap = "butt"; ctx.beginPath(); arc(V, HOP[STILL.red], 0, 1); ctx.stroke();
        } else heads.forEach(function (h) { red(V, h[0], h[1], lonAt(t)); });
        var a1 = still ? 1 : clamp01((e - 2500) / 200), a2 = still ? 1 : easeOut((e - 2600) / 250);
        var ny = newYork(V, a1, a2), nyA = ny ? clamp01((ny.z - 0.2) / 0.12) * (still ? 1 : clamp01((e - 2700) / 300)) : 0;
        placeNy(ny, nyA);
      }

      /* ── running: an internal clock that only moves while the globe is on screen and not paused ── */
      function loop(now) {
        raf = 0;
        if (!running()) return;
        var dt = last ? Math.min(50, now - last) : 16;
        last = now; te += dt; root.__kmT = te;   /* QA: the globe's clock (remove when porting) */
        if (root.__kmPerf) { var p0 = performance.now(); frame(te); root.__kmPerf.push(performance.now() - p0); } else frame(te);
        raf = requestAnimationFrame(loop);
      }
      function running() { return started && !reduced && inView && !paused && !document.hidden; }
      function kick() { if (running() && !raf) { last = 0; raf = requestAnimationFrame(loop); } }
      function start() { if (started) return; started = true; root.classList.add("is-run"); te = 0; frame(0); kick(); }

      var onVis = function () { kick(); };
      document.addEventListener("visibilitychange", onVis);
      /* Pause / Play: the button says what it will do (so no aria-pressed as well) */
      var onBtn = function () { paused = !paused; btn.textContent = paused ? "Play" : "Pause"; kick(); };
      if (btn) { if (reduced) btn.hidden = true; else btn.addEventListener("click", onBtn); }

      if (reduced) { started = true; frame(0); }
      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(function (es) {
          es.forEach(function (en) {
            inView = en.isIntersecting;
            if (!started && en.intersectionRatio >= 0.4) start();
            kick();
          });
        }, { threshold: [0, 0.4] });
        io.observe(box);
      } else inView = true;
      if (!reduced && !stitched) start();
      if (!started && !("IntersectionObserver" in window)) start();
      if ("ResizeObserver" in window) {
        ro = new ResizeObserver(function () { if (size() && started && !raf) frame(te); });
        ro.observe(box);
      }
      mo = new MutationObserver(function () { colours(); if (started && !raf) frame(te); });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-skin"] });

      return function () {
        if (raf) cancelAnimationFrame(raf); raf = 0;
        if (io) io.disconnect(); if (ro) ro.disconnect(); if (mo) mo.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        if (btn) { btn.removeEventListener("click", onBtn); btn.hidden = false; btn.textContent = "Pause"; }
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
        ctxs.setTransform(1, 0, 0, 1, 0, 0); ctxs.clearRect(0, 0, cvs.width, cvs.height);
        if (nyL) { nyL.style.transform = ""; nyL.style.opacity = ""; nyL.classList.remove("is-west"); }
        root.classList.remove("is-live", "is-run");
      };
    }
  };
})();
