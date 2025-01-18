import { deepStrictEqual } from "assert";

import build_graphql_fields_from_abis from "../src/build_graphql_fields_from_abis.mjs";

const abi = {
  version: "eosio::abi/1.2",
  types: [
    {
      new_type_name: "B_pair_time_point_sec_int64_E",
      type: "pair_time_point_sec_int64"
    },
    {
      new_type_name: "block_signing_authority",
      type: "variant_block_signing_authority_v0"
    },
    {
      new_type_name: "blockchain_parameters_t",
      type: "blockchain_parameters_v1"
    }
  ],
  structs: [
    {
      name: "abi_hash",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        },
        {
          name: "hash",
          type: "checksum256"
        }
      ]
    },
    {
      name: "activate",
      base: "",
      fields: [
        {
          name: "feature_digest",
          type: "checksum256"
        }
      ]
    },
    {
      name: "authority",
      base: "",
      fields: [
        {
          name: "threshold",
          type: "uint32"
        },
        {
          name: "keys",
          type: "key_weight[]"
        },
        {
          name: "accounts",
          type: "permission_level_weight[]"
        },
        {
          name: "waits",
          type: "wait_weight[]"
        }
      ]
    },
    {
      name: "bid_refund",
      base: "",
      fields: [
        {
          name: "bidder",
          type: "name"
        },
        {
          name: "amount",
          type: "asset"
        }
      ]
    },
    {
      name: "bidname",
      base: "",
      fields: [
        {
          name: "bidder",
          type: "name"
        },
        {
          name: "newname",
          type: "name"
        },
        {
          name: "bid",
          type: "asset"
        }
      ]
    },
    {
      name: "bidrefund",
      base: "",
      fields: [
        {
          name: "bidder",
          type: "name"
        },
        {
          name: "newname",
          type: "name"
        }
      ]
    },
    {
      name: "block_header",
      base: "",
      fields: [
        {
          name: "timestamp",
          type: "uint32"
        },
        {
          name: "producer",
          type: "name"
        },
        {
          name: "confirmed",
          type: "uint16"
        },
        {
          name: "previous",
          type: "checksum256"
        },
        {
          name: "transaction_mroot",
          type: "checksum256"
        },
        {
          name: "action_mroot",
          type: "checksum256"
        },
        {
          name: "schedule_version",
          type: "uint32"
        },
        {
          name: "new_producers",
          type: "producer_schedule?"
        }
      ]
    },
    {
      name: "block_info_record",
      base: "",
      fields: [
        {
          name: "version",
          type: "uint8"
        },
        {
          name: "block_height",
          type: "uint32"
        },
        {
          name: "block_timestamp",
          type: "time_point"
        }
      ]
    },
    {
      name: "block_signing_authority_v0",
      base: "",
      fields: [
        {
          name: "threshold",
          type: "uint32"
        },
        {
          name: "keys",
          type: "key_weight[]"
        }
      ]
    },
    {
      name: "blockchain_parameters",
      base: "",
      fields: [
        {
          name: "max_block_net_usage",
          type: "uint64"
        },
        {
          name: "target_block_net_usage_pct",
          type: "uint32"
        },
        {
          name: "max_transaction_net_usage",
          type: "uint32"
        },
        {
          name: "base_per_transaction_net_usage",
          type: "uint32"
        },
        {
          name: "net_usage_leeway",
          type: "uint32"
        },
        {
          name: "context_free_discount_net_usage_num",
          type: "uint32"
        },
        {
          name: "context_free_discount_net_usage_den",
          type: "uint32"
        },
        {
          name: "max_block_cpu_usage",
          type: "uint32"
        },
        {
          name: "target_block_cpu_usage_pct",
          type: "uint32"
        },
        {
          name: "max_transaction_cpu_usage",
          type: "uint32"
        },
        {
          name: "min_transaction_cpu_usage",
          type: "uint32"
        },
        {
          name: "max_transaction_lifetime",
          type: "uint32"
        },
        {
          name: "deferred_trx_expiration_window",
          type: "uint32"
        },
        {
          name: "max_transaction_delay",
          type: "uint32"
        },
        {
          name: "max_inline_action_size",
          type: "uint32"
        },
        {
          name: "max_inline_action_depth",
          type: "uint16"
        },
        {
          name: "max_authority_depth",
          type: "uint16"
        }
      ]
    },
    {
      name: "blockchain_parameters_v1",
      base: "blockchain_parameters",
      fields: [
        {
          name: "max_action_return_value_size",
          type: "uint32$"
        }
      ]
    },
    {
      name: "buyram",
      base: "",
      fields: [
        {
          name: "payer",
          type: "name"
        },
        {
          name: "receiver",
          type: "name"
        },
        {
          name: "quant",
          type: "asset"
        }
      ]
    },
    {
      name: "buyrambytes",
      base: "",
      fields: [
        {
          name: "payer",
          type: "name"
        },
        {
          name: "receiver",
          type: "name"
        },
        {
          name: "bytes",
          type: "uint32"
        }
      ]
    },
    {
      name: "buyrex",
      base: "",
      fields: [
        {
          name: "from",
          type: "name"
        },
        {
          name: "amount",
          type: "asset"
        }
      ]
    },
    {
      name: "canceldelay",
      base: "",
      fields: [
        {
          name: "canceling_auth",
          type: "permission_level"
        },
        {
          name: "trx_id",
          type: "checksum256"
        }
      ]
    },
    {
      name: "cfgpowerup",
      base: "",
      fields: [
        {
          name: "args",
          type: "powerup_config"
        }
      ]
    },
    {
      name: "claimrewards",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        }
      ]
    },
    {
      name: "closerex",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        }
      ]
    },
    {
      name: "cnclrexorder",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        }
      ]
    },
    {
      name: "connector",
      base: "",
      fields: [
        {
          name: "balance",
          type: "asset"
        },
        {
          name: "weight",
          type: "float64"
        }
      ]
    },
    {
      name: "consolidate",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        }
      ]
    },
    {
      name: "defcpuloan",
      base: "",
      fields: [
        {
          name: "from",
          type: "name"
        },
        {
          name: "loan_num",
          type: "uint64"
        },
        {
          name: "amount",
          type: "asset"
        }
      ]
    },
    {
      name: "defnetloan",
      base: "",
      fields: [
        {
          name: "from",
          type: "name"
        },
        {
          name: "loan_num",
          type: "uint64"
        },
        {
          name: "amount",
          type: "asset"
        }
      ]
    },
    {
      name: "delegatebw",
      base: "",
      fields: [
        {
          name: "from",
          type: "name"
        },
        {
          name: "receiver",
          type: "name"
        },
        {
          name: "stake_net_quantity",
          type: "asset"
        },
        {
          name: "stake_cpu_quantity",
          type: "asset"
        },
        {
          name: "transfer",
          type: "bool"
        }
      ]
    },
    {
      name: "delegated_bandwidth",
      base: "",
      fields: [
        {
          name: "from",
          type: "name"
        },
        {
          name: "to",
          type: "name"
        },
        {
          name: "net_weight",
          type: "asset"
        },
        {
          name: "cpu_weight",
          type: "asset"
        }
      ]
    },
    {
      name: "deleteauth",
      base: "",
      fields: [
        {
          name: "account",
          type: "name"
        },
        {
          name: "permission",
          type: "name"
        },
        {
          name: "authorized_by",
          type: "name$"
        }
      ]
    },
    {
      name: "deposit",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        },
        {
          name: "amount",
          type: "asset"
        }
      ]
    },
    {
      name: "eosio_global_state",
      base: "blockchain_parameters",
      fields: [
        {
          name: "max_ram_size",
          type: "uint64"
        },
        {
          name: "total_ram_bytes_reserved",
          type: "uint64"
        },
        {
          name: "total_ram_stake",
          type: "int64"
        },
        {
          name: "last_producer_schedule_update",
          type: "block_timestamp_type"
        },
        {
          name: "last_pervote_bucket_fill",
          type: "time_point"
        },
        {
          name: "pervote_bucket",
          type: "int64"
        },
        {
          name: "perblock_bucket",
          type: "int64"
        },
        {
          name: "total_unpaid_blocks",
          type: "uint32"
        },
        {
          name: "total_activated_stake",
          type: "int64"
        },
        {
          name: "thresh_activated_stake_time",
          type: "time_point"
        },
        {
          name: "last_producer_schedule_size",
          type: "uint16"
        },
        {
          name: "total_producer_vote_weight",
          type: "float64"
        },
        {
          name: "last_name_close",
          type: "block_timestamp_type"
        }
      ]
    },
    {
      name: "eosio_global_state2",
      base: "",
      fields: [
        {
          name: "new_ram_per_block",
          type: "uint16"
        },
        {
          name: "last_ram_increase",
          type: "block_timestamp_type"
        },
        {
          name: "last_block_num",
          type: "block_timestamp_type"
        },
        {
          name: "total_producer_votepay_share",
          type: "float64"
        },
        {
          name: "revision",
          type: "uint8"
        }
      ]
    },
    {
      name: "eosio_global_state3",
      base: "",
      fields: [
        {
          name: "last_vpay_state_update",
          type: "time_point"
        },
        {
          name: "total_vpay_share_change_rate",
          type: "float64"
        }
      ]
    },
    {
      name: "eosio_global_state4",
      base: "",
      fields: [
        {
          name: "continuous_rate",
          type: "float64"
        },
        {
          name: "inflation_pay_factor",
          type: "int64"
        },
        {
          name: "votepay_factor",
          type: "int64"
        }
      ]
    },
    {
      name: "exchange_state",
      base: "",
      fields: [
        {
          name: "supply",
          type: "asset"
        },
        {
          name: "base",
          type: "connector"
        },
        {
          name: "quote",
          type: "connector"
        }
      ]
    },
    {
      name: "fundcpuloan",
      base: "",
      fields: [
        {
          name: "from",
          type: "name"
        },
        {
          name: "loan_num",
          type: "uint64"
        },
        {
          name: "payment",
          type: "asset"
        }
      ]
    },
    {
      name: "fundnetloan",
      base: "",
      fields: [
        {
          name: "from",
          type: "name"
        },
        {
          name: "loan_num",
          type: "uint64"
        },
        {
          name: "payment",
          type: "asset"
        }
      ]
    },
    {
      name: "init",
      base: "",
      fields: [
        {
          name: "version",
          type: "varuint32"
        },
        {
          name: "core",
          type: "symbol"
        }
      ]
    },
    {
      name: "key_weight",
      base: "",
      fields: [
        {
          name: "key",
          type: "public_key"
        },
        {
          name: "weight",
          type: "uint16"
        }
      ]
    },
    {
      name: "limitauthchg",
      base: "",
      fields: [
        {
          name: "account",
          type: "name"
        },
        {
          name: "allow_perms",
          type: "name[]"
        },
        {
          name: "disallow_perms",
          type: "name[]"
        }
      ]
    },
    {
      name: "linkauth",
      base: "",
      fields: [
        {
          name: "account",
          type: "name"
        },
        {
          name: "code",
          type: "name"
        },
        {
          name: "type",
          type: "name"
        },
        {
          name: "requirement",
          type: "name"
        },
        {
          name: "authorized_by",
          type: "name$"
        }
      ]
    },
    {
      name: "mvfrsavings",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        },
        {
          name: "rex",
          type: "asset"
        }
      ]
    },
    {
      name: "mvtosavings",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        },
        {
          name: "rex",
          type: "asset"
        }
      ]
    },
    {
      name: "name_bid",
      base: "",
      fields: [
        {
          name: "newname",
          type: "name"
        },
        {
          name: "high_bidder",
          type: "name"
        },
        {
          name: "high_bid",
          type: "int64"
        },
        {
          name: "last_bid_time",
          type: "time_point"
        }
      ]
    },
    {
      name: "newaccount",
      base: "",
      fields: [
        {
          name: "creator",
          type: "name"
        },
        {
          name: "name",
          type: "name"
        },
        {
          name: "owner",
          type: "authority"
        },
        {
          name: "active",
          type: "authority"
        }
      ]
    },
    {
      name: "onblock",
      base: "",
      fields: [
        {
          name: "header",
          type: "block_header"
        }
      ]
    },
    {
      name: "onerror",
      base: "",
      fields: [
        {
          name: "sender_id",
          type: "uint128"
        },
        {
          name: "sent_trx",
          type: "bytes"
        }
      ]
    },
    {
      name: "pair_time_point_sec_int64",
      base: "",
      fields: [
        {
          name: "key",
          type: "time_point_sec"
        },
        {
          name: "value",
          type: "int64"
        }
      ]
    },
    {
      name: "permission_level",
      base: "",
      fields: [
        {
          name: "actor",
          type: "name"
        },
        {
          name: "permission",
          type: "name"
        }
      ]
    },
    {
      name: "permission_level_weight",
      base: "",
      fields: [
        {
          name: "permission",
          type: "permission_level"
        },
        {
          name: "weight",
          type: "uint16"
        }
      ]
    },
    {
      name: "powerup",
      base: "",
      fields: [
        {
          name: "payer",
          type: "name"
        },
        {
          name: "receiver",
          type: "name"
        },
        {
          name: "days",
          type: "uint32"
        },
        {
          name: "net_frac",
          type: "int64"
        },
        {
          name: "cpu_frac",
          type: "int64"
        },
        {
          name: "max_payment",
          type: "asset"
        }
      ]
    },
    {
      name: "powerup_config",
      base: "",
      fields: [
        {
          name: "net",
          type: "powerup_config_resource"
        },
        {
          name: "cpu",
          type: "powerup_config_resource"
        },
        {
          name: "powerup_days",
          type: "uint32?"
        },
        {
          name: "min_powerup_fee",
          type: "asset?"
        }
      ]
    },
    {
      name: "powerup_config_resource",
      base: "",
      fields: [
        {
          name: "current_weight_ratio",
          type: "int64?"
        },
        {
          name: "target_weight_ratio",
          type: "int64?"
        },
        {
          name: "assumed_stake_weight",
          type: "int64?"
        },
        {
          name: "target_timestamp",
          type: "time_point_sec?"
        },
        {
          name: "exponent",
          type: "float64?"
        },
        {
          name: "decay_secs",
          type: "uint32?"
        },
        {
          name: "min_price",
          type: "asset?"
        },
        {
          name: "max_price",
          type: "asset?"
        }
      ]
    },
    {
      name: "powerup_order",
      base: "",
      fields: [
        {
          name: "version",
          type: "uint8"
        },
        {
          name: "id",
          type: "uint64"
        },
        {
          name: "owner",
          type: "name"
        },
        {
          name: "net_weight",
          type: "int64"
        },
        {
          name: "cpu_weight",
          type: "int64"
        },
        {
          name: "expires",
          type: "time_point_sec"
        }
      ]
    },
    {
      name: "powerup_state",
      base: "",
      fields: [
        {
          name: "version",
          type: "uint8"
        },
        {
          name: "net",
          type: "powerup_state_resource"
        },
        {
          name: "cpu",
          type: "powerup_state_resource"
        },
        {
          name: "powerup_days",
          type: "uint32"
        },
        {
          name: "min_powerup_fee",
          type: "asset"
        }
      ]
    },
    {
      name: "powerup_state_resource",
      base: "",
      fields: [
        {
          name: "version",
          type: "uint8"
        },
        {
          name: "weight",
          type: "int64"
        },
        {
          name: "weight_ratio",
          type: "int64"
        },
        {
          name: "assumed_stake_weight",
          type: "int64"
        },
        {
          name: "initial_weight_ratio",
          type: "int64"
        },
        {
          name: "target_weight_ratio",
          type: "int64"
        },
        {
          name: "initial_timestamp",
          type: "time_point_sec"
        },
        {
          name: "target_timestamp",
          type: "time_point_sec"
        },
        {
          name: "exponent",
          type: "float64"
        },
        {
          name: "decay_secs",
          type: "uint32"
        },
        {
          name: "min_price",
          type: "asset"
        },
        {
          name: "max_price",
          type: "asset"
        },
        {
          name: "utilization",
          type: "int64"
        },
        {
          name: "adjusted_utilization",
          type: "int64"
        },
        {
          name: "utilization_timestamp",
          type: "time_point_sec"
        }
      ]
    },
    {
      name: "powerupexec",
      base: "",
      fields: [
        {
          name: "user",
          type: "name"
        },
        {
          name: "max",
          type: "uint16"
        }
      ]
    },
    {
      name: "producer_info",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        },
        {
          name: "total_votes",
          type: "float64"
        },
        {
          name: "producer_key",
          type: "public_key"
        },
        {
          name: "is_active",
          type: "bool"
        },
        {
          name: "url",
          type: "string"
        },
        {
          name: "unpaid_blocks",
          type: "uint32"
        },
        {
          name: "last_claim_time",
          type: "time_point"
        },
        {
          name: "location",
          type: "uint16"
        },
        {
          name: "producer_authority",
          type: "block_signing_authority$"
        }
      ]
    },
    {
      name: "producer_info2",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        },
        {
          name: "votepay_share",
          type: "float64"
        },
        {
          name: "last_votepay_share_update",
          type: "time_point"
        }
      ]
    },
    {
      name: "producer_key",
      base: "",
      fields: [
        {
          name: "producer_name",
          type: "name"
        },
        {
          name: "block_signing_key",
          type: "public_key"
        }
      ]
    },
    {
      name: "producer_schedule",
      base: "",
      fields: [
        {
          name: "version",
          type: "uint32"
        },
        {
          name: "producers",
          type: "producer_key[]"
        }
      ]
    },
    {
      name: "refund",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        }
      ]
    },
    {
      name: "refund_request",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        },
        {
          name: "request_time",
          type: "time_point_sec"
        },
        {
          name: "net_amount",
          type: "asset"
        },
        {
          name: "cpu_amount",
          type: "asset"
        }
      ]
    },
    {
      name: "regproducer",
      base: "",
      fields: [
        {
          name: "producer",
          type: "name"
        },
        {
          name: "producer_key",
          type: "public_key"
        },
        {
          name: "url",
          type: "string"
        },
        {
          name: "location",
          type: "uint16"
        }
      ]
    },
    {
      name: "regproducer2",
      base: "",
      fields: [
        {
          name: "producer",
          type: "name"
        },
        {
          name: "producer_authority",
          type: "block_signing_authority"
        },
        {
          name: "url",
          type: "string"
        },
        {
          name: "location",
          type: "uint16"
        }
      ]
    },
    {
      name: "regproxy",
      base: "",
      fields: [
        {
          name: "proxy",
          type: "name"
        },
        {
          name: "isproxy",
          type: "bool"
        }
      ]
    },
    {
      name: "rentcpu",
      base: "",
      fields: [
        {
          name: "from",
          type: "name"
        },
        {
          name: "receiver",
          type: "name"
        },
        {
          name: "loan_payment",
          type: "asset"
        },
        {
          name: "loan_fund",
          type: "asset"
        }
      ]
    },
    {
      name: "rentnet",
      base: "",
      fields: [
        {
          name: "from",
          type: "name"
        },
        {
          name: "receiver",
          type: "name"
        },
        {
          name: "loan_payment",
          type: "asset"
        },
        {
          name: "loan_fund",
          type: "asset"
        }
      ]
    },
    {
      name: "rex_balance",
      base: "",
      fields: [
        {
          name: "version",
          type: "uint8"
        },
        {
          name: "owner",
          type: "name"
        },
        {
          name: "vote_stake",
          type: "asset"
        },
        {
          name: "rex_balance",
          type: "asset"
        },
        {
          name: "matured_rex",
          type: "int64"
        },
        {
          name: "rex_maturities",
          type: "B_pair_time_point_sec_int64_E[]"
        }
      ]
    },
    {
      name: "rex_fund",
      base: "",
      fields: [
        {
          name: "version",
          type: "uint8"
        },
        {
          name: "owner",
          type: "name"
        },
        {
          name: "balance",
          type: "asset"
        }
      ]
    },
    {
      name: "rex_loan",
      base: "",
      fields: [
        {
          name: "version",
          type: "uint8"
        },
        {
          name: "from",
          type: "name"
        },
        {
          name: "receiver",
          type: "name"
        },
        {
          name: "payment",
          type: "asset"
        },
        {
          name: "balance",
          type: "asset"
        },
        {
          name: "total_staked",
          type: "asset"
        },
        {
          name: "loan_num",
          type: "uint64"
        },
        {
          name: "expiration",
          type: "time_point"
        }
      ]
    },
    {
      name: "rex_order",
      base: "",
      fields: [
        {
          name: "version",
          type: "uint8"
        },
        {
          name: "owner",
          type: "name"
        },
        {
          name: "rex_requested",
          type: "asset"
        },
        {
          name: "proceeds",
          type: "asset"
        },
        {
          name: "stake_change",
          type: "asset"
        },
        {
          name: "order_time",
          type: "time_point"
        },
        {
          name: "is_open",
          type: "bool"
        }
      ]
    },
    {
      name: "rex_pool",
      base: "",
      fields: [
        {
          name: "version",
          type: "uint8"
        },
        {
          name: "total_lent",
          type: "asset"
        },
        {
          name: "total_unlent",
          type: "asset"
        },
        {
          name: "total_rent",
          type: "asset"
        },
        {
          name: "total_lendable",
          type: "asset"
        },
        {
          name: "total_rex",
          type: "asset"
        },
        {
          name: "namebid_proceeds",
          type: "asset"
        },
        {
          name: "loan_num",
          type: "uint64"
        }
      ]
    },
    {
      name: "rex_return_buckets",
      base: "",
      fields: [
        {
          name: "version",
          type: "uint8"
        },
        {
          name: "return_buckets",
          type: "pair_time_point_sec_int64[]"
        }
      ]
    },
    {
      name: "rex_return_pool",
      base: "",
      fields: [
        {
          name: "version",
          type: "uint8"
        },
        {
          name: "last_dist_time",
          type: "time_point_sec"
        },
        {
          name: "pending_bucket_time",
          type: "time_point_sec"
        },
        {
          name: "oldest_bucket_time",
          type: "time_point_sec"
        },
        {
          name: "pending_bucket_proceeds",
          type: "int64"
        },
        {
          name: "current_rate_of_increase",
          type: "int64"
        },
        {
          name: "proceeds",
          type: "int64"
        }
      ]
    },
    {
      name: "rexexec",
      base: "",
      fields: [
        {
          name: "user",
          type: "name"
        },
        {
          name: "max",
          type: "uint16"
        }
      ]
    },
    {
      name: "rmvproducer",
      base: "",
      fields: [
        {
          name: "producer",
          type: "name"
        }
      ]
    },
    {
      name: "sellram",
      base: "",
      fields: [
        {
          name: "account",
          type: "name"
        },
        {
          name: "bytes",
          type: "int64"
        }
      ]
    },
    {
      name: "sellrex",
      base: "",
      fields: [
        {
          name: "from",
          type: "name"
        },
        {
          name: "rex",
          type: "asset"
        }
      ]
    },
    {
      name: "setabi",
      base: "",
      fields: [
        {
          name: "account",
          type: "name"
        },
        {
          name: "abi",
          type: "bytes"
        },
        {
          name: "memo",
          type: "string$"
        }
      ]
    },
    {
      name: "setacctcpu",
      base: "",
      fields: [
        {
          name: "account",
          type: "name"
        },
        {
          name: "cpu_weight",
          type: "int64?"
        }
      ]
    },
    {
      name: "setacctnet",
      base: "",
      fields: [
        {
          name: "account",
          type: "name"
        },
        {
          name: "net_weight",
          type: "int64?"
        }
      ]
    },
    {
      name: "setacctram",
      base: "",
      fields: [
        {
          name: "account",
          type: "name"
        },
        {
          name: "ram_bytes",
          type: "int64?"
        }
      ]
    },
    {
      name: "setalimits",
      base: "",
      fields: [
        {
          name: "account",
          type: "name"
        },
        {
          name: "ram_bytes",
          type: "int64"
        },
        {
          name: "net_weight",
          type: "int64"
        },
        {
          name: "cpu_weight",
          type: "int64"
        }
      ]
    },
    {
      name: "setcode",
      base: "",
      fields: [
        {
          name: "account",
          type: "name"
        },
        {
          name: "vmtype",
          type: "uint8"
        },
        {
          name: "vmversion",
          type: "uint8"
        },
        {
          name: "code",
          type: "bytes"
        },
        {
          name: "memo",
          type: "string$"
        }
      ]
    },
    {
      name: "setinflation",
      base: "",
      fields: [
        {
          name: "annual_rate",
          type: "int64"
        },
        {
          name: "inflation_pay_factor",
          type: "int64"
        },
        {
          name: "votepay_factor",
          type: "int64"
        }
      ]
    },
    {
      name: "setparams",
      base: "",
      fields: [
        {
          name: "params",
          type: "blockchain_parameters_t"
        }
      ]
    },
    {
      name: "setpriv",
      base: "",
      fields: [
        {
          name: "account",
          type: "name"
        },
        {
          name: "is_priv",
          type: "uint8"
        }
      ]
    },
    {
      name: "setram",
      base: "",
      fields: [
        {
          name: "max_ram_size",
          type: "uint64"
        }
      ]
    },
    {
      name: "setramrate",
      base: "",
      fields: [
        {
          name: "bytes_per_block",
          type: "uint16"
        }
      ]
    },
    {
      name: "setrex",
      base: "",
      fields: [
        {
          name: "balance",
          type: "asset"
        }
      ]
    },
    {
      name: "undelegatebw",
      base: "",
      fields: [
        {
          name: "from",
          type: "name"
        },
        {
          name: "receiver",
          type: "name"
        },
        {
          name: "unstake_net_quantity",
          type: "asset"
        },
        {
          name: "unstake_cpu_quantity",
          type: "asset"
        }
      ]
    },
    {
      name: "unlinkauth",
      base: "",
      fields: [
        {
          name: "account",
          type: "name"
        },
        {
          name: "code",
          type: "name"
        },
        {
          name: "type",
          type: "name"
        },
        {
          name: "authorized_by",
          type: "name$"
        }
      ]
    },
    {
      name: "unregprod",
      base: "",
      fields: [
        {
          name: "producer",
          type: "name"
        }
      ]
    },
    {
      name: "unstaketorex",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        },
        {
          name: "receiver",
          type: "name"
        },
        {
          name: "from_net",
          type: "asset"
        },
        {
          name: "from_cpu",
          type: "asset"
        }
      ]
    },
    {
      name: "updateauth",
      base: "",
      fields: [
        {
          name: "account",
          type: "name"
        },
        {
          name: "permission",
          type: "name"
        },
        {
          name: "parent",
          type: "name"
        },
        {
          name: "auth",
          type: "authority"
        },
        {
          name: "authorized_by",
          type: "name$"
        }
      ]
    },
    {
      name: "updaterex",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        }
      ]
    },
    {
      name: "updtrevision",
      base: "",
      fields: [
        {
          name: "revision",
          type: "uint8"
        }
      ]
    },
    {
      name: "user_resources",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        },
        {
          name: "net_weight",
          type: "asset"
        },
        {
          name: "cpu_weight",
          type: "asset"
        },
        {
          name: "ram_bytes",
          type: "int64"
        }
      ]
    },
    {
      name: "voteproducer",
      base: "",
      fields: [
        {
          name: "voter",
          type: "name"
        },
        {
          name: "proxy",
          type: "name"
        },
        {
          name: "producers",
          type: "name[]"
        }
      ]
    },
    {
      name: "voter_info",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        },
        {
          name: "proxy",
          type: "name"
        },
        {
          name: "producers",
          type: "name[]"
        },
        {
          name: "staked",
          type: "int64"
        },
        {
          name: "last_vote_weight",
          type: "float64"
        },
        {
          name: "proxied_vote_weight",
          type: "float64"
        },
        {
          name: "is_proxy",
          type: "bool"
        },
        {
          name: "flags1",
          type: "uint32"
        },
        {
          name: "reserved2",
          type: "uint32"
        },
        {
          name: "reserved3",
          type: "asset"
        }
      ]
    },
    {
      name: "voteupdate",
      base: "",
      fields: [
        {
          name: "voter_name",
          type: "name"
        }
      ]
    },
    {
      name: "wait_weight",
      base: "",
      fields: [
        {
          name: "wait_sec",
          type: "uint32"
        },
        {
          name: "weight",
          type: "uint16"
        }
      ]
    },
    {
      name: "wasmcfg",
      base: "",
      fields: [
        {
          name: "settings",
          type: "name"
        }
      ]
    },
    {
      name: "withdraw",
      base: "",
      fields: [
        {
          name: "owner",
          type: "name"
        },
        {
          name: "amount",
          type: "asset"
        }
      ]
    },
    {
      name: "limit_auth_change",
      base: "",
      fields: [
        {
          name: "version",
          type: "uint8"
        },
        {
          name: "account",
          type: "name"
        },
        {
          name: "allow_perms",
          type: "name[]"
        },
        {
          name: "disallow_perms",
          type: "name[]"
        }
      ]
    }
  ],
  actions: [
    {
      name: "activate",
      type: "activate"
    },
    {
      name: "bidname",
      type: "bidname"
    },
    {
      name: "bidrefund",
      type: "bidrefund"
    },
    {
      name: "buyram",
      type: "buyram"
    },
    {
      name: "buyrambytes",
      type: "buyrambytes"
    },
    {
      name: "buyrex",
      type: "buyrex"
    },
    {
      name: "canceldelay",
      type: "canceldelay"
    },
    {
      name: "cfgpowerup",
      type: "cfgpowerup"
    },
    {
      name: "claimrewards",
      type: "claimrewards"
    },
    {
      name: "closerex",
      type: "closerex"
    },
    {
      name: "cnclrexorder",
      type: "cnclrexorder"
    },
    {
      name: "consolidate",
      type: "consolidate"
    },
    {
      name: "defcpuloan",
      type: "defcpuloan"
    },
    {
      name: "defnetloan",
      type: "defnetloan"
    },
    {
      name: "delegatebw",
      type: "delegatebw"
    },
    {
      name: "deleteauth",
      type: "deleteauth"
    },
    {
      name: "deposit",
      type: "deposit"
    },
    {
      name: "fundcpuloan",
      type: "fundcpuloan"
    },
    {
      name: "fundnetloan",
      type: "fundnetloan"
    },
    {
      name: "init",
      type: "init"
    },
    {
      name: "limitauthchg",
      type: "limitauthchg"
    },
    {
      name: "linkauth",
      type: "linkauth"
    },
    {
      name: "mvfrsavings",
      type: "mvfrsavings"
    },
    {
      name: "mvtosavings",
      type: "mvtosavings"
    },
    {
      name: "newaccount",
      type: "newaccount"
    },
    {
      name: "onblock",
      type: "onblock"
    },
    {
      name: "onerror",
      type: "onerror"
    },
    {
      name: "powerup",
      type: "powerup"
    },
    {
      name: "powerupexec",
      type: "powerupexec"
    },
    {
      name: "refund",
      type: "refund"
    },
    {
      name: "regproducer",
      type: "regproducer"
    },
    {
      name: "regproducer2",
      type: "regproducer2"
    },
    {
      name: "regproxy",
      type: "regproxy"
    },
    {
      name: "rentcpu",
      type: "rentcpu"
    },
    {
      name: "rentnet",
      type: "rentnet"
    },
    {
      name: "rexexec",
      type: "rexexec"
    },
    {
      name: "rmvproducer",
      type: "rmvproducer"
    },
    {
      name: "sellram",
      type: "sellram"
    },
    {
      name: "sellrex",
      type: "sellrex"
    },
    {
      name: "setabi",
      type: "setabi"
    },
    {
      name: "setacctcpu",
      type: "setacctcpu"
    },
    {
      name: "setacctnet",
      type: "setacctnet"
    },
    {
      name: "setacctram",
      type: "setacctram"
    },
    {
      name: "setalimits",
      type: "setalimits"
    },
    {
      name: "setcode",
      type: "setcode"
    },
    {
      name: "setinflation",
      type: "setinflation"
    },
    {
      name: "setparams",
      type: "setparams"
    },
    {
      name: "setpriv",
      type: "setpriv"
    },
    {
      name: "setram",
      type: "setram"
    },
    {
      name: "setramrate",
      type: "setramrate"
    },
    {
      name: "setrex",
      type: "setrex"
    },
    {
      name: "undelegatebw",
      type: "undelegatebw"
    },
    {
      name: "unlinkauth",
      type: "unlinkauth"
    },
    {
      name: "unregprod",
      type: "unregprod"
    },
    {
      name: "unstaketorex",
      type: "unstaketorex"
    },
    {
      name: "updateauth",
      type: "updateauth"
    },
    {
      name: "updaterex",
      type: "updaterex"
    },
    {
      name: "updtrevision",
      type: "updtrevision"
    },
    {
      name: "voteproducer",
      type: "voteproducer"
    },
    {
      name: "voteupdate",
      type: "voteupdate"
    },
    {
      name: "wasmcfg",
      type: "wasmcfg"
    },
    {
      name: "withdraw",
      type: "withdraw"
    }
  ],
  tables: [
    {
      name: "abihash",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "abi_hash"
    },
    {
      name: "bidrefunds",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "bid_refund"
    },
    {
      name: "blockinfo",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "block_info_record"
    },
    {
      name: "cpuloan",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "rex_loan"
    },
    {
      name: "delband",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "delegated_bandwidth"
    },
    {
      name: "global",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "eosio_global_state"
    },
    {
      name: "global2",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "eosio_global_state2"
    },
    {
      name: "global3",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "eosio_global_state3"
    },
    {
      name: "global4",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "eosio_global_state4"
    },
    {
      name: "namebids",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "name_bid"
    },
    {
      name: "netloan",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "rex_loan"
    },
    {
      name: "powup.order",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "powerup_order"
    },
    {
      name: "powup.state",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "powerup_state"
    },
    {
      name: "producers",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "producer_info"
    },
    {
      name: "producers2",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "producer_info2"
    },
    {
      name: "rammarket",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "exchange_state"
    },
    {
      name: "refunds",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "refund_request"
    },
    {
      name: "retbuckets",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "rex_return_buckets"
    },
    {
      name: "rexbal",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "rex_balance"
    },
    {
      name: "rexfund",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "rex_fund"
    },
    {
      name: "rexpool",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "rex_pool"
    },
    {
      name: "rexqueue",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "rex_order"
    },
    {
      name: "rexretpool",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "rex_return_pool"
    },
    {
      name: "userres",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "user_resources"
    },
    {
      name: "voters",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "voter_info"
    },
    {
      name: "limitauthchg",
      index_type: "i64",
      key_names: [],
      key_types: [],
      type: "limit_auth_change"
    }
  ],
  error_messages: [],
  abi_extensions: [],
  variants: [
    {
      name: "variant_block_signing_authority_v0",
      types: ["block_signing_authority_v0"]
    }
  ],
  action_results: [],
  kv_tables: {}
};

const ast = {
  query_fields: { eosio: { name: "eosio", type: "eosio_query" } },
  mutation_fields: { eosio: { type: "eosio" } },
  ast_list: {
    eosio: {
      abi_hash: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "hash",
          type: "checksum256",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      activate: [
        {
          name: "feature_digest",
          type: "checksum256",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      authority: [
        {
          name: "threshold",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "keys",
          type: "key_weight",
          $info: {
            object: true,
            optional: false,
            list: true,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "accounts",
          type: "permission_level_weight",
          $info: {
            object: true,
            optional: false,
            list: true,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "waits",
          type: "wait_weight",
          $info: {
            object: true,
            optional: false,
            list: true,
            binary_ex: false,
            variant: false
          }
        }
      ],
      bid_refund: [
        {
          name: "bidder",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "amount",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      bidname: [
        {
          name: "bidder",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "newname",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "bid",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      bidrefund: [
        {
          name: "bidder",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "newname",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      block_header: [
        {
          name: "timestamp",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "producer",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "confirmed",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "previous",
          type: "checksum256",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "transaction_mroot",
          type: "checksum256",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "action_mroot",
          type: "checksum256",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "schedule_version",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "new_producers",
          type: "producer_schedule",
          $info: {
            object: true,
            optional: true,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      block_info_record: [
        {
          name: "version",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "block_height",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "block_timestamp",
          type: "time_point",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      block_signing_authority_v0: [
        {
          name: "threshold",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "keys",
          type: "key_weight",
          $info: {
            object: true,
            optional: false,
            list: true,
            binary_ex: false,
            variant: false
          }
        }
      ],
      blockchain_parameters: [
        {
          name: "max_block_net_usage",
          type: "uint64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "target_block_net_usage_pct",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_transaction_net_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "base_per_transaction_net_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "net_usage_leeway",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "context_free_discount_net_usage_num",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "context_free_discount_net_usage_den",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_block_cpu_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "target_block_cpu_usage_pct",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_transaction_cpu_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "min_transaction_cpu_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_transaction_lifetime",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "deferred_trx_expiration_window",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_transaction_delay",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_inline_action_size",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_inline_action_depth",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_authority_depth",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      blockchain_parameters_v1: [
        {
          name: "max_block_net_usage",
          type: "uint64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "target_block_net_usage_pct",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_transaction_net_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "base_per_transaction_net_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "net_usage_leeway",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "context_free_discount_net_usage_num",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "context_free_discount_net_usage_den",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_block_cpu_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "target_block_cpu_usage_pct",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_transaction_cpu_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "min_transaction_cpu_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_transaction_lifetime",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "deferred_trx_expiration_window",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_transaction_delay",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_inline_action_size",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_inline_action_depth",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_authority_depth",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_action_return_value_size",
          type: "uint32",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: true,
            variant: false
          }
        }
      ],
      buyram: [
        {
          name: "payer",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "receiver",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "quant",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      buyrambytes: [
        {
          name: "payer",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "receiver",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "bytes",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      buyrex: [
        {
          name: "from",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "amount",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      canceldelay: [
        {
          name: "canceling_auth",
          type: "permission_level",
          $info: {
            object: true,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "trx_id",
          type: "checksum256",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      cfgpowerup: [
        {
          name: "args",
          type: "powerup_config",
          $info: {
            object: true,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      claimrewards: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      closerex: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      cnclrexorder: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      connector: [
        {
          name: "balance",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "weight",
          type: "float64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      consolidate: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      defcpuloan: [
        {
          name: "from",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "loan_num",
          type: "uint64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "amount",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      defnetloan: [
        {
          name: "from",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "loan_num",
          type: "uint64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "amount",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      delegatebw: [
        {
          name: "from",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "receiver",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "stake_net_quantity",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "stake_cpu_quantity",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "transfer",
          type: "bool",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      delegated_bandwidth: [
        {
          name: "from",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "to",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "net_weight",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "cpu_weight",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      deleteauth: [
        {
          name: "account",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "permission",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "authorized_by",
          type: "name",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: true,
            variant: false
          }
        }
      ],
      deposit: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "amount",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      eosio_global_state: [
        {
          name: "max_block_net_usage",
          type: "uint64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "target_block_net_usage_pct",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_transaction_net_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "base_per_transaction_net_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "net_usage_leeway",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "context_free_discount_net_usage_num",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "context_free_discount_net_usage_den",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_block_cpu_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "target_block_cpu_usage_pct",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_transaction_cpu_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "min_transaction_cpu_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_transaction_lifetime",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "deferred_trx_expiration_window",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_transaction_delay",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_inline_action_size",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_inline_action_depth",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_authority_depth",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_ram_size",
          type: "uint64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "total_ram_bytes_reserved",
          type: "uint64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "total_ram_stake",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "last_producer_schedule_update",
          type: "block_timestamp_type",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "last_pervote_bucket_fill",
          type: "time_point",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "pervote_bucket",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "perblock_bucket",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "total_unpaid_blocks",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "total_activated_stake",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "thresh_activated_stake_time",
          type: "time_point",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "last_producer_schedule_size",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "total_producer_vote_weight",
          type: "float64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "last_name_close",
          type: "block_timestamp_type",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      eosio_global_state2: [
        {
          name: "new_ram_per_block",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "last_ram_increase",
          type: "block_timestamp_type",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "last_block_num",
          type: "block_timestamp_type",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "total_producer_votepay_share",
          type: "float64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "revision",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      eosio_global_state3: [
        {
          name: "last_vpay_state_update",
          type: "time_point",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "total_vpay_share_change_rate",
          type: "float64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      eosio_global_state4: [
        {
          name: "continuous_rate",
          type: "float64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "inflation_pay_factor",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "votepay_factor",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      exchange_state: [
        {
          name: "supply",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "base",
          type: "connector",
          $info: {
            object: true,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "quote",
          type: "connector",
          $info: {
            object: true,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      fundcpuloan: [
        {
          name: "from",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "loan_num",
          type: "uint64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "payment",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      fundnetloan: [
        {
          name: "from",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "loan_num",
          type: "uint64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "payment",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      init: [
        {
          name: "version",
          type: "varuint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "core",
          type: "symbol",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      key_weight: [
        {
          name: "key",
          type: "public_key",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "weight",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      limitauthchg: [
        {
          name: "account",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "allow_perms",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: true,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "disallow_perms",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: true,
            binary_ex: false,
            variant: false
          }
        }
      ],
      linkauth: [
        {
          name: "account",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "code",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "type",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "requirement",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "authorized_by",
          type: "name",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: true,
            variant: false
          }
        }
      ],
      mvfrsavings: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "rex",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      mvtosavings: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "rex",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      name_bid: [
        {
          name: "newname",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "high_bidder",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "high_bid",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "last_bid_time",
          type: "time_point",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      newaccount: [
        {
          name: "creator",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "name",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "owner",
          type: "authority",
          $info: {
            object: true,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "active",
          type: "authority",
          $info: {
            object: true,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      onblock: [
        {
          name: "header",
          type: "block_header",
          $info: {
            object: true,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      onerror: [
        {
          name: "sender_id",
          type: "uint128",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "sent_trx",
          type: "bytes",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      pair_time_point_sec_int64: [
        {
          name: "key",
          type: "time_point_sec",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "value",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      permission_level: [
        {
          name: "actor",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "permission",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      permission_level_weight: [
        {
          name: "permission",
          type: "permission_level",
          $info: {
            object: true,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "weight",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      powerup: [
        {
          name: "payer",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "receiver",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "days",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "net_frac",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "cpu_frac",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_payment",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      powerup_config: [
        {
          name: "net",
          type: "powerup_config_resource",
          $info: {
            object: true,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "cpu",
          type: "powerup_config_resource",
          $info: {
            object: true,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "powerup_days",
          type: "uint32",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "min_powerup_fee",
          type: "asset",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      powerup_config_resource: [
        {
          name: "current_weight_ratio",
          type: "int64",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "target_weight_ratio",
          type: "int64",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "assumed_stake_weight",
          type: "int64",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "target_timestamp",
          type: "time_point_sec",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "exponent",
          type: "float64",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "decay_secs",
          type: "uint32",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "min_price",
          type: "asset",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_price",
          type: "asset",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      powerup_order: [
        {
          name: "version",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "id",
          type: "uint64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "net_weight",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "cpu_weight",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "expires",
          type: "time_point_sec",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      powerup_state: [
        {
          name: "version",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "net",
          type: "powerup_state_resource",
          $info: {
            object: true,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "cpu",
          type: "powerup_state_resource",
          $info: {
            object: true,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "powerup_days",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "min_powerup_fee",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      powerup_state_resource: [
        {
          name: "version",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "weight",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "weight_ratio",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "assumed_stake_weight",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "initial_weight_ratio",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "target_weight_ratio",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "initial_timestamp",
          type: "time_point_sec",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "target_timestamp",
          type: "time_point_sec",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "exponent",
          type: "float64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "decay_secs",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "min_price",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_price",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "utilization",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "adjusted_utilization",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "utilization_timestamp",
          type: "time_point_sec",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      powerupexec: [
        {
          name: "user",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      producer_info: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "total_votes",
          type: "float64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "producer_key",
          type: "public_key",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "is_active",
          type: "bool",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "url",
          type: "string",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "unpaid_blocks",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "last_claim_time",
          type: "time_point",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "location",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "producer_authority",
          type: "block_signing_authority",
          $info: {
            object: true,
            optional: true,
            list: false,
            binary_ex: true,
            variant: false
          }
        }
      ],
      producer_info2: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "votepay_share",
          type: "float64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "last_votepay_share_update",
          type: "time_point",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      producer_key: [
        {
          name: "producer_name",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "block_signing_key",
          type: "public_key",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      producer_schedule: [
        {
          name: "version",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "producers",
          type: "producer_key",
          $info: {
            object: true,
            optional: false,
            list: true,
            binary_ex: false,
            variant: false
          }
        }
      ],
      refund: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      refund_request: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "request_time",
          type: "time_point_sec",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "net_amount",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "cpu_amount",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      regproducer: [
        {
          name: "producer",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "producer_key",
          type: "public_key",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "url",
          type: "string",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "location",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      regproducer2: [
        {
          name: "producer",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "producer_authority",
          type: "block_signing_authority",
          $info: {
            object: true,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "url",
          type: "string",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "location",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      regproxy: [
        {
          name: "proxy",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "isproxy",
          type: "bool",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      rentcpu: [
        {
          name: "from",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "receiver",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "loan_payment",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "loan_fund",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      rentnet: [
        {
          name: "from",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "receiver",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "loan_payment",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "loan_fund",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      rex_balance: [
        {
          name: "version",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "vote_stake",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "rex_balance",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "matured_rex",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "rex_maturities",
          type: "B_pair_time_point_sec_int64_E",
          $info: {
            object: true,
            optional: false,
            list: true,
            binary_ex: false,
            variant: false
          }
        }
      ],
      rex_fund: [
        {
          name: "version",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "balance",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      rex_loan: [
        {
          name: "version",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "from",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "receiver",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "payment",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "balance",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "total_staked",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "loan_num",
          type: "uint64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "expiration",
          type: "time_point",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      rex_order: [
        {
          name: "version",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "rex_requested",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "proceeds",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "stake_change",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "order_time",
          type: "time_point",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "is_open",
          type: "bool",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      rex_pool: [
        {
          name: "version",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "total_lent",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "total_unlent",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "total_rent",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "total_lendable",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "total_rex",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "namebid_proceeds",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "loan_num",
          type: "uint64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      rex_return_buckets: [
        {
          name: "version",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "return_buckets",
          type: "pair_time_point_sec_int64",
          $info: {
            object: true,
            optional: false,
            list: true,
            binary_ex: false,
            variant: false
          }
        }
      ],
      rex_return_pool: [
        {
          name: "version",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "last_dist_time",
          type: "time_point_sec",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "pending_bucket_time",
          type: "time_point_sec",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "oldest_bucket_time",
          type: "time_point_sec",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "pending_bucket_proceeds",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "current_rate_of_increase",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "proceeds",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      rexexec: [
        {
          name: "user",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      rmvproducer: [
        {
          name: "producer",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      sellram: [
        {
          name: "account",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "bytes",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      sellrex: [
        {
          name: "from",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "rex",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      setabi: [
        {
          name: "account",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "abi",
          type: "bytes",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "memo",
          type: "string",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: true,
            variant: false
          }
        }
      ],
      setacctcpu: [
        {
          name: "account",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "cpu_weight",
          type: "int64",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      setacctnet: [
        {
          name: "account",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "net_weight",
          type: "int64",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      setacctram: [
        {
          name: "account",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "ram_bytes",
          type: "int64",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      setalimits: [
        {
          name: "account",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "ram_bytes",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "net_weight",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "cpu_weight",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      setcode: [
        {
          name: "account",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "vmtype",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "vmversion",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "code",
          type: "bytes",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "memo",
          type: "string",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: true,
            variant: false
          }
        }
      ],
      setinflation: [
        {
          name: "annual_rate",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "inflation_pay_factor",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "votepay_factor",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      setparams: [
        {
          name: "params",
          type: "blockchain_parameters_t",
          $info: {
            object: true,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      setpriv: [
        {
          name: "account",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "is_priv",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      setram: [
        {
          name: "max_ram_size",
          type: "uint64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      setramrate: [
        {
          name: "bytes_per_block",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      setrex: [
        {
          name: "balance",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      undelegatebw: [
        {
          name: "from",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "receiver",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "unstake_net_quantity",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "unstake_cpu_quantity",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      unlinkauth: [
        {
          name: "account",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "code",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "type",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "authorized_by",
          type: "name",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: true,
            variant: false
          }
        }
      ],
      unregprod: [
        {
          name: "producer",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      unstaketorex: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "receiver",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "from_net",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "from_cpu",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      updateauth: [
        {
          name: "account",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "permission",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "parent",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "auth",
          type: "authority",
          $info: {
            object: true,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "authorized_by",
          type: "name",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: true,
            variant: false
          }
        }
      ],
      updaterex: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      updtrevision: [
        {
          name: "revision",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      user_resources: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "net_weight",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "cpu_weight",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "ram_bytes",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      voteproducer: [
        {
          name: "voter",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "proxy",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "producers",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: true,
            binary_ex: false,
            variant: false
          }
        }
      ],
      voter_info: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "proxy",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "producers",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: true,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "staked",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "last_vote_weight",
          type: "float64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "proxied_vote_weight",
          type: "float64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "is_proxy",
          type: "bool",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "flags1",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "reserved2",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "reserved3",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      voteupdate: [
        {
          name: "voter_name",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      wait_weight: [
        {
          name: "wait_sec",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "weight",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      wasmcfg: [
        {
          name: "settings",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      withdraw: [
        {
          name: "owner",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "amount",
          type: "asset",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      limit_auth_change: [
        {
          name: "version",
          type: "uint8",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "account",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "allow_perms",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: true,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "disallow_perms",
          type: "name",
          $info: {
            object: false,
            optional: false,
            list: true,
            binary_ex: false,
            variant: false
          }
        }
      ],
      variant_block_signing_authority_v0: [
        {
          name: "block_signing_authority_v0",
          type: "block_signing_authority_v0",
          $info: {
            object: true,
            optional: true,
            list: false,
            binary_ex: true,
            variant: true
          }
        }
      ],
      B_pair_time_point_sec_int64_E: [
        {
          name: "key",
          type: "time_point_sec",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "value",
          type: "int64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        }
      ],
      block_signing_authority: [
        {
          name: "block_signing_authority_v0",
          type: "block_signing_authority_v0",
          $info: {
            object: true,
            optional: true,
            list: false,
            binary_ex: true,
            variant: true
          }
        }
      ],
      blockchain_parameters_t: [
        {
          name: "max_block_net_usage",
          type: "uint64",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "target_block_net_usage_pct",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_transaction_net_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "base_per_transaction_net_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "net_usage_leeway",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "context_free_discount_net_usage_num",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "context_free_discount_net_usage_den",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_block_cpu_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "target_block_cpu_usage_pct",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_transaction_cpu_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "min_transaction_cpu_usage",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_transaction_lifetime",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "deferred_trx_expiration_window",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_transaction_delay",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_inline_action_size",
          type: "uint32",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_inline_action_depth",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_authority_depth",
          type: "uint16",
          $info: {
            object: false,
            optional: false,
            list: false,
            binary_ex: false,
            variant: false
          }
        },
        {
          name: "max_action_return_value_size",
          type: "uint32",
          $info: {
            object: false,
            optional: true,
            list: false,
            binary_ex: true,
            variant: false
          }
        }
      ]
    }
  }
};

export default async (tests) => {
  tests.add("Testing eosio build_graphql_fields_from_abis", () => {
    deepStrictEqual(
      ast,
      JSON.parse(
        JSON.stringify(
          build_graphql_fields_from_abis([{ abi, account_name: "eosio" }])
        )
      )
    );
  });
};
