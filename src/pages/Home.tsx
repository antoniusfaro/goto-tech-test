import Header from "../components/organism/Header"
import SearchInput from "../components/organism/SearchInput"
import ContactList from "../components/templates/ContactList"

const Home = () => {
  return (
    <>
      <Header title="Contact List" />
      <SearchInput />
      <ContactList />
    </>
  )
}

export default Home;
