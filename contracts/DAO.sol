// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract MyDAO {

    // Define variables
    address public admin;
    mapping(address => bool) public members;
    mapping(bytes32 => Proposal) public proposals;
    uint public proposalCount;

    // Define events
    event MembershipChanged(address member, bool isMember);
    event ProposalCreated(bytes32 proposalId, address proposer);
    event Voted(bytes32 proposalId, address voter, bool inSupport, uint256 voteWeight);
    event ProposalResult(bytes32 proposalId, uint256 yesVotes, uint256 noVotes, bool passed);

    // Define structs
    struct Proposal {
        address proposer;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        mapping(address => bool) voted;
        bool open;
    }

    // Constructor
    constructor() {
        admin = msg.sender;
    }

    // Modifier for admin-only functions
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Modifier for member-only functions
    modifier onlyMembers() {
        require(members[msg.sender], "Only members can perform this action");
        _;
    }

    // Function to apply for membership
    function applyForMembership() public {
        members[msg.sender] = true;
        emit MembershipChanged(msg.sender, true);
    }

    // Function for admin to approve membership
    function approveMembership(address member) public onlyAdmin {
        members[member] = true;
        emit MembershipChanged(member, true);
    }

    // Function to create a proposal
    function createProposal(string memory description) public onlyMembers {
        bytes32 proposalId = keccak256(abi.encodePacked(msg.sender, description, proposalCount));
        Proposal storage newProposal = proposals[proposalId];
        newProposal.proposer = msg.sender;
        newProposal.description = description;
        newProposal.open = true;
        proposalCount++;
        emit ProposalCreated(proposalId, msg.sender);
    }

    // Function to vote on a proposal
    function vote(bytes32 proposalId, bool inSupport) public onlyMembers {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.voted[msg.sender] == false, "You have already voted");
        require(proposal.open == true, "Voting for this proposal is closed");
        uint256 voteWeight = 1; // for simplicity, each member has 1 vote
        if (inSupport) {
            proposal.yesVotes += voteWeight;
        } else {
            proposal.noVotes += voteWeight;
        }
        proposal.voted[msg.sender] = true;
        emit Voted(proposalId, msg.sender, inSupport, voteWeight);
    }

    // Function for admin to close voting and declare the result of a proposal
    function closeProposal(bytes32 proposalId) public onlyAdmin {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.open == true, "Voting for this proposal is already closed");
        proposal.open = false;
        uint256 yesVotes = proposal.yesVotes;
        uint256 noVotes = proposal.noVotes;
        bool passed = yesVotes > noVotes;
        emit ProposalResult(proposalId, yesVotes, noVotes, passed);
    }
}