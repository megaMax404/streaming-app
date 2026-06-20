function Footer() {
  return (
    <div style={styles.footer}>
      <div style={styles.container}>
        <p className="footer-title">Copyright © 2026 Doohd.com เว็บ ดู หนังออนไลน์ ฟรี หนัง ใหม่ 2026</p>
        <p>ดูหนังออนไลน์ HD พากย์ไทย เต็มเรื่อง มาสเตอร์ ดูหนังHD ดูหนังใหม่ หนัง ดูหนังฟรี ดูหนัง เว็บดูหนังออนไลน์ หนังมาใหม่ Master zoom หนังออนไลน์ ซูม.
เว็บดูหนังออนไลน์ เว็บหนังที่ชัดและดีที่สุดในเวลานี้</p>
      </div>
    </div>
  );
}

const styles = {
  footer: {
    background: "#111",
    color: "#aaa",
    marginTop: "50px"
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center"
  }
};

export default Footer;