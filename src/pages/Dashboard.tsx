import Nav from "../components/Layout/Nav";
import Container from "../components/Layout/Container";
import { motion } from "framer-motion";

export default function Dashboard(){
  // Later: fetch real stats with React Query (counts, last scans, etc.)
  const cards = [
    { title: "Total Scans", value: 42 },
    { title: "High Severity", value: 6 },
    { title: "Last 7 Days", value: 18 },
  ];
  return (
    <>
      <Nav />
      <Container>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid sm:grid-cols-3 gap-4">
          {cards.map((c,i)=>(
            <motion.div key={i} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}
              className="rounded-2xl border p-4 shadow-sm bg-white">
              <div className="text-sm text-gray-600">{c.title}</div>
              <div className="text-3xl font-extrabold">{c.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="rounded-2xl border p-4 bg-white">
            <h3 className="font-semibold mb-2">Recent Activity</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Health Check — wheat — severity medium</li>
              <li>• Health Check — potato — severity low</li>
              <li>• Health Check — rice — severity high</li>
            </ul>
          </motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="rounded-2xl border p-4 bg-white">
            <h3 className="font-semibold mb-2">Tips</h3>
            <p className="text-sm text-gray-700">
              Keep leaves dry when possible; avoid late-day overhead irrigation; sanitize tools after pruning hotspots.
            </p>
          </motion.div>
        </div>
      </Container>
    </>
  );
}
